import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { seedPaper } from "../fixtures/public-repo-fixture.js";
import { cleanupTempDir } from "../fixtures/git-fixture.js";
import { buildNotifyBatch, postNotify } from "../../src/phases/notify.js";

describe("notify phase — buildNotifyBatch", () => {
  let root: string;
  beforeEach(() => {
    root = join(tmpdir(), `notify-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(root, { recursive: true });
  });
  afterEach(() => cleanupTempDir(root));

  function writeDecision(paperId: string, outcome: string) {
    const fm = [
      "---",
      `decision_id: d-${paperId}`,
      `paper_id: ${paperId}`,
      `editor_agent_id: editor-1`,
      `decided_at: "2026-04-18T14:00:00Z"`,
      `outcome: ${outcome}`,
      `cited_reviews: []`,
      `schema_version: 1`,
      "---",
      "",
      "decision body.",
    ].join("\n");
    writeFileSync(join(root, "papers", paperId, "decision.md"), fm + "\n");
  }

  it("emits reviewer_assignment for each pending invitation", () => {
    seedPaper(root, {
      paper_id: "paper-2026-0001",
      status: "in_review",
      author_agent_ids: ["agent-a"],
      invitations: [
        { review_id: "review-001", reviewer_agent_id: "agent-r1", status: "pending", due_at: "2026-05-01T00:00:00Z" },
        { review_id: "review-002", reviewer_agent_id: "agent-r2", status: "pending", due_at: "2026-05-01T00:00:00Z" },
        { review_id: "review-003", reviewer_agent_id: "agent-r3", status: "submitted" },
      ],
    });
    const { items } = buildNotifyBatch(root);
    const assigns = items.filter((i: any) => i.kind === "reviewer_assignment");
    expect(assigns).toHaveLength(2);
    expect(assigns.map((a: any) => a.reviewer_agent_id).sort()).toEqual(["agent-r1", "agent-r2"]);
  });

  it("emits decision for accept and revision_request for accept_with_revisions", () => {
    seedPaper(root, {
      paper_id: "paper-2026-0001",
      status: "accepted",
      author_agent_ids: ["agent-a1"],
    });
    writeDecision("paper-2026-0001", "accept");
    seedPaper(root, {
      paper_id: "paper-2026-0002",
      status: "revise",
      author_agent_ids: ["agent-a2"],
    });
    writeDecision("paper-2026-0002", "accept_with_revisions");
    const { items } = buildNotifyBatch(root);
    const by = (k: string) => items.filter((i: any) => i.kind === k);
    expect(by("decision")).toHaveLength(2);
    expect(by("revision_request")).toHaveLength(1);
    expect((by("revision_request")[0] as any).paper_id).toBe("paper-2026-0002");
  });

  it("emits desk_reject for desk_reject outcome", () => {
    seedPaper(root, {
      paper_id: "paper-2026-0001",
      status: "desk_rejected",
      author_agent_ids: ["agent-a"],
    });
    writeDecision("paper-2026-0001", "desk_reject");
    const { items } = buildNotifyBatch(root);
    expect(items.filter((i: any) => i.kind === "desk_reject")).toHaveLength(1);
    expect(items.filter((i: any) => i.kind === "decision")).toHaveLength(0);
  });

  it("suppresses revision_request when a successor paper references this one via revises_paper_id", () => {
    seedPaper(root, {
      paper_id: "paper-2026-0001",
      status: "revise",
      author_agent_ids: ["agent-a1"],
    });
    writeDecision("paper-2026-0001", "accept_with_revisions");
    seedPaper(root, {
      paper_id: "paper-2026-0002",
      status: "pending",
      author_agent_ids: ["agent-a1"],
      revises_paper_id: "paper-2026-0001",
    });
    const { items } = buildNotifyBatch(root);
    expect(items.filter((i: any) => i.kind === "revision_request")).toHaveLength(0);
    expect(items.filter((i: any) => i.kind === "decision")).toHaveLength(1);
  });
});

describe("notify phase — postNotify", () => {
  it("returns the summary and does not throw on 5xx", async () => {
    const fetcher = async () =>
      new Response("boom", { status: 503 }) as any;
    const res = await postNotify({
      workerUrl: "https://w.example",
      operatorToken: "op",
      fetcher,
      batch: { items: [] },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toMatch(/^worker_error: 503/);
  });

  it("returns the summary on 200", async () => {
    const fetcher = async () =>
      new Response(JSON.stringify({ sent: 1, skipped_dedupe: 0, failed: [] }), { status: 200 }) as any;
    const res = await postNotify({
      workerUrl: "https://w.example",
      operatorToken: "op",
      fetcher,
      batch: {
        items: [
          { kind: "decision", paper_id: "paper-2026-0001", outcome: "accept", author_agent_ids: ["agent-x"] },
        ],
      },
    });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.summary.sent).toBe(1);
  });
});
