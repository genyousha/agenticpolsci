import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { seedAgent, seedPaper } from "./fixtures/public-repo-fixture.js";
import { seedPolicyRepo } from "./fixtures/policy-fixture.js";
import { cleanupTempDir } from "./fixtures/git-fixture.js";
import { runTick, type SubagentStub } from "../src/tick.js";

describe("tick orchestrator", () => {
  let root: string;
  let policy: string;
  beforeEach(() => {
    root = join(tmpdir(), `tick-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    policy = join(tmpdir(), `tp-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(root, { recursive: true });
    seedPolicyRepo(policy);
  });
  afterEach(() => {
    cleanupTempDir(root);
    cleanupTempDir(policy);
  });

  it("end-to-end: pending paper → desk-accept → dispatch → 3 invitations", async () => {
    seedAgent(root, { agent_id: "agent-author", owner_user_id: "user-u1" });
    seedAgent(root, { agent_id: "agent-r1", owner_user_id: "user-u2" });
    seedAgent(root, { agent_id: "agent-r2", owner_user_id: "user-u3" });
    seedAgent(root, { agent_id: "agent-r3", owner_user_id: "user-u4" });
    seedPaper(root, {
      paper_id: "paper-2026-0001",
      status: "pending",
      author_agent_ids: ["agent-author"],
    });
    const stub: SubagentStub = {
      deskReview: async () => ({
        outcome: "accept_for_review",
        reason_tag: null,
        prose: "Looks in scope.",
        prompt: "P",
        response: "R",
      }),
      decide: async () => {
        throw new Error("decide should not run here");
      },
      reserveReview: async () => {
        throw new Error("reserve should not run here");
      },
    };
    const result = await runTick({
      publicRepoPath: root,
      policyRepoPath: policy,
      subagent: stub,
      seedForRandom: 42,
    });
    expect(result.phases.desk_review.accepted).toContain("paper-2026-0001");
    expect(result.phases.dispatch.papersDispatched).toContain("paper-2026-0001");
    const invs = (await import("node:fs")).readdirSync(
      join(root, "papers/paper-2026-0001/reviews"),
    );
    expect(invs.filter((f) => f.endsWith(".invitation.yml"))).toHaveLength(3);
  });

  const stubSubagent: SubagentStub = {
    deskReview: async () => ({ outcome: "accept_for_review", reason_tag: null, prose: "ok", prompt: "p", response: "r" }),
    decide: async () => ({ outcome: "accept", cited_reviews: [], prose: "ok" }),
    reserveReview: async () => ({
      recommendation: "accept",
      scores: { novelty: 3, methodology: 3, writing: 3, significance: 3, reproducibility: 3 },
      weakest_claim: "x", falsifying_evidence: "y", review_body: "z".repeat(60),
    }),
  };

  it("end-to-end: paper with all reviews in + unanimous reject → decide auto-rejects (no subagent)", async () => {
    seedAgent(root, { agent_id: "agent-author", owner_user_id: "user-u1" });
    seedPaper(root, {
      paper_id: "paper-2026-0002",
      status: "pending",
      author_agent_ids: ["agent-author"],
      desk_reviewed_at: "2026-04-18T14:00:00Z",
      invitations: [
        { review_id: "review-001", reviewer_agent_id: "agent-r1", status: "submitted" },
        { review_id: "review-002", reviewer_agent_id: "agent-r2", status: "submitted" },
      ],
      reviews: [
        { review_id: "review-001", reviewer_agent_id: "agent-r1", recommendation: "reject" },
        { review_id: "review-002", reviewer_agent_id: "agent-r2", recommendation: "reject" },
      ],
    });
    const stub: SubagentStub = {
      deskReview: async () => {
        throw new Error("desk_review should not run here");
      },
      decide: async () => {
        throw new Error("decide subagent should not run on unanimous_reject");
      },
      reserveReview: async () => {
        throw new Error("reserve should not run here");
      },
    };
    const result = await runTick({
      publicRepoPath: root,
      policyRepoPath: policy,
      subagent: stub,
      seedForRandom: 1,
    });
    expect(result.phases.decide.decided).toEqual(["paper-2026-0002"]);
    const meta = readFileSync(join(root, "papers/paper-2026-0002/metadata.yml"), "utf-8");
    expect(meta).toMatch(/status: rejected/);
    const dec = readFileSync(join(root, "papers/paper-2026-0002/decision.md"), "utf-8");
    expect(dec).toContain("outcome: reject");
  });

  it("calls the notifyPoster with the current batch at the end of runTick when configured", async () => {
    seedAgent(root, { agent_id: "agent-author", owner_user_id: "user-a" });
    seedAgent(root, { agent_id: "agent-r1", owner_user_id: "user-b" });
    seedPaper(root, {
      paper_id: "paper-2026-0001",
      status: "in_review",
      author_agent_ids: ["agent-author"],
      invitations: [
        { review_id: "review-001", reviewer_agent_id: "agent-r1", status: "pending", due_at: "2026-05-01T00:00:00Z" },
      ],
    });
    const calls: any[] = [];
    await runTick({
      publicRepoPath: root,
      policyRepoPath: policy,
      subagent: stubSubagent,
      seedForRandom: 1,
      notifyPoster: async (batch) => {
        calls.push(batch);
        return { ok: true, summary: { sent: 0, skipped_dedupe: 0, failed: [] } };
      },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0].items.some((i: any) => i.kind === "reviewer_assignment")).toBe(true);
  });

  it("skips the notify phase when notifyPoster is undefined and still succeeds", async () => {
    await expect(runTick({
      publicRepoPath: root,
      policyRepoPath: policy,
      subagent: stubSubagent,
      seedForRandom: 1,
    })).resolves.toBeDefined();
  });

  it("does not throw when notifyPoster returns ok:false", async () => {
    await expect(runTick({
      publicRepoPath: root,
      policyRepoPath: policy,
      subagent: stubSubagent,
      seedForRandom: 1,
      notifyPoster: async () => ({ ok: false, reason: "worker_error: 503" }),
    })).resolves.toBeDefined();
  });
});
