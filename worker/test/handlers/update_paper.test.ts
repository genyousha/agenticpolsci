import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { env } from "cloudflare:test";
import { updatePaper } from "../../src/handlers/update_paper.js";
import { ensureMigrated, seedUser, seedAgent } from "../helpers/db.js";
import { installGithubMock } from "../helpers/github-mock.js";
import { buildMetadataYaml } from "../../src/lib/metadata.js";

function makeMeta(overrides: {
  paper_id: string;
  submission_id?: string;
  status?: "pending" | "revise" | "in_review" | "accepted";
  author_agent_ids: string[];
  coauthor_agent_ids?: string[];
  type?: "research" | "replication" | "comment";
  title?: string;
  replicates_doi?: string;
}): string {
  return buildMetadataYaml({
    paper_id: overrides.paper_id,
    submission_id: overrides.submission_id ?? "sub-original",
    journal_id: "agent-polsci-alpha",
    type: overrides.type ?? "research",
    title: overrides.title ?? "Original Title",
    abstract: "A".repeat(80),
    author_agent_ids: overrides.author_agent_ids,
    coauthor_agent_ids: overrides.coauthor_agent_ids ?? [],
    topics: ["comparative-politics"],
    submitted_at: "2026-04-19T10:00:00.000Z",
    status: overrides.status ?? "revise",
    word_count: 7000,
    model_used: "claude-opus-4-5",
    replicates_doi: overrides.replicates_doi,
  });
}

const validInput = {
  paper_id: "paper-2026-0001",
  title: "Revised Title",
  abstract:
    "Revised abstract: we extend the original analysis by adding three additional democracies and by tightening the pre-registration window to strengthen identification.",
  paper_markdown: "# Revised\n\nRevised manuscript body.\n".padEnd(400, "x"),
  paper_redacted_markdown: "# Revised\n\n**Author:** [redacted]\n\nRevised body.\n".padEnd(400, "x"),
  topics: ["comparative-politics", "electoral-systems"],
  coauthor_agent_ids: [] as string[],
  word_count: 8200,
  model_used: "claude-opus-4-7",
};

describe("update_paper", () => {
  let restore: () => void = () => {};
  beforeEach(async () => {
    await ensureMigrated();
  });
  afterEach(() => restore());

  it("overwrites manuscripts + metadata in place, preserves paper_id/submission_id/submitted_at, sets status=pending and revised_at", async () => {
    const { user_id } = await seedUser({ balance_cents: 500 });
    const { agent_id } = await seedAgent({ owner_user_id: user_id });
    const mock = installGithubMock({
      "papers/paper-2026-0001/metadata.yml": makeMeta({
        paper_id: "paper-2026-0001",
        submission_id: "sub-original",
        status: "revise",
        author_agent_ids: [agent_id],
      }),
      "papers/paper-2026-0001/paper.md": "# Original\n".padEnd(400, "x"),
      "papers/paper-2026-0001/paper.redacted.md": "# Original\n".padEnd(400, "x"),
    });
    restore = mock.restore;

    const res = await updatePaper(
      env,
      { kind: "agent", agent_id, owner_user_id: user_id },
      validInput,
    );
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.value.paper_id).toBe("paper-2026-0001");
    expect(res.value.submission_id).toBe("sub-original");
    expect(res.value.status).toBe("pending");
    expect(res.value.revised_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    const meta = mock.files.get("papers/paper-2026-0001/metadata.yml")!.content;
    expect(meta).toContain("paper_id: paper-2026-0001");
    expect(meta).toContain("submission_id: sub-original");
    expect(meta).toContain('submitted_at: "2026-04-19T10:00:00.000Z"');
    expect(meta).toContain(`revised_at: "${res.value.revised_at}"`);
    expect(meta).toContain("status: pending");
    expect(meta).toContain('title: "Revised Title"');
    expect(meta).toContain("word_count: 8200");
    expect(mock.files.get("papers/paper-2026-0001/paper.md")!.content).toContain("Revised manuscript body.");
    expect(mock.files.get("papers/paper-2026-0001/paper.redacted.md")!.content).toContain("Revised body.");

    // No fee debit — balance unchanged.
    const bal = await env.DB
      .prepare("SELECT balance_cents FROM balances WHERE user_id = ?")
      .bind(user_id)
      .first<{ balance_cents: number }>();
    expect(bal?.balance_cents).toBe(500);
  });

  it("returns not_found for a paper that doesn't exist", async () => {
    const { user_id } = await seedUser({ balance_cents: 500 });
    const { agent_id } = await seedAgent({ owner_user_id: user_id });
    const mock = installGithubMock({});
    restore = mock.restore;
    const res = await updatePaper(
      env,
      { kind: "agent", agent_id, owner_user_id: user_id },
      validInput,
    );
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe("not_found");
  });

  it("forbids updates from an agent who isn't an author or coauthor", async () => {
    const { user_id } = await seedUser({ balance_cents: 500 });
    const { agent_id: author_id } = await seedAgent({ owner_user_id: user_id });
    const { agent_id: intruder_id } = await seedAgent({ owner_user_id: user_id });
    const mock = installGithubMock({
      "papers/paper-2026-0001/metadata.yml": makeMeta({
        paper_id: "paper-2026-0001",
        status: "revise",
        author_agent_ids: [author_id],
      }),
    });
    restore = mock.restore;
    const res = await updatePaper(
      env,
      { kind: "agent", agent_id: intruder_id, owner_user_id: user_id },
      validInput,
    );
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe("forbidden");
  });

  it("allows a listed coauthor to update the paper", async () => {
    const { user_id } = await seedUser({ balance_cents: 500 });
    const { agent_id: author_id } = await seedAgent({ owner_user_id: user_id });
    const { agent_id: coauthor_id } = await seedAgent({ owner_user_id: user_id });
    const mock = installGithubMock({
      "papers/paper-2026-0001/metadata.yml": makeMeta({
        paper_id: "paper-2026-0001",
        status: "revise",
        author_agent_ids: [author_id],
        coauthor_agent_ids: [coauthor_id],
      }),
    });
    restore = mock.restore;
    const res = await updatePaper(
      env,
      { kind: "agent", agent_id: coauthor_id, owner_user_id: user_id },
      validInput,
    );
    expect(res.ok).toBe(true);
  });

  it("rejects updates once the paper is in_review", async () => {
    const { user_id } = await seedUser({ balance_cents: 500 });
    const { agent_id } = await seedAgent({ owner_user_id: user_id });
    const mock = installGithubMock({
      "papers/paper-2026-0001/metadata.yml": makeMeta({
        paper_id: "paper-2026-0001",
        status: "in_review",
        author_agent_ids: [agent_id],
      }),
    });
    restore = mock.restore;
    const res = await updatePaper(
      env,
      { kind: "agent", agent_id, owner_user_id: user_id },
      validInput,
    );
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe("conflict");
  });

  it("rejects a replication paper whose new title lacks the [Replication] prefix", async () => {
    const { user_id } = await seedUser({ balance_cents: 500 });
    const { agent_id } = await seedAgent({ owner_user_id: user_id });
    const mock = installGithubMock({
      "papers/paper-2026-0001/metadata.yml": makeMeta({
        paper_id: "paper-2026-0001",
        type: "replication",
        title: "[Replication] Original Title",
        status: "revise",
        author_agent_ids: [agent_id],
        replicates_doi: "10.1111/ajps.99999",
      }),
    });
    restore = mock.restore;
    const res = await updatePaper(
      env,
      { kind: "agent", agent_id, owner_user_id: user_id },
      { ...validInput, title: "A non-prefixed revised title" },
    );
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe("invalid_input");
  });

  it("preserves replicates_doi across the revision", async () => {
    const { user_id } = await seedUser({ balance_cents: 500 });
    const { agent_id } = await seedAgent({ owner_user_id: user_id });
    const mock = installGithubMock({
      "papers/paper-2026-0001/metadata.yml": makeMeta({
        paper_id: "paper-2026-0001",
        type: "replication",
        title: "[Replication] Original Title",
        status: "revise",
        author_agent_ids: [agent_id],
        replicates_doi: "10.1111/ajps.99999",
      }),
    });
    restore = mock.restore;
    const res = await updatePaper(
      env,
      { kind: "agent", agent_id, owner_user_id: user_id },
      { ...validInput, title: "[Replication] Revised Title" },
    );
    expect(res.ok).toBe(true);
    const meta = mock.files.get("papers/paper-2026-0001/metadata.yml")!.content;
    expect(meta).toContain("replicates_doi: 10.1111/ajps.99999");
    expect(meta).toContain("type: replication");
  });
});
