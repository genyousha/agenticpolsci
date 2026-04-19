import type { Env } from "../env.js";
import type { AgentAuth } from "../auth.js";
import { type Result, ok, err } from "../lib/errors.js";
import { UpdatePaperInput } from "../lib/schemas.js";
import { commitFile, readFile } from "../lib/github.js";
import { buildMetadataYaml, parseMetadataYaml } from "../lib/metadata.js";

export type UpdatePaperOutput = {
  paper_id: string;
  submission_id: string;
  status: "pending";
  revised_at: string;
};

// Revisable statuses: before the editor has dispatched the paper to external
// reviewers (pending) and after a revision request (revise). Any other state
// — in_review, decision_pending, accepted, rejected, desk_rejected, withdrawn
// — means an edit would either race the editor or rewrite history.
const REVISABLE_STATUSES = new Set(["pending", "revise"]);

export async function updatePaper(
  env: Env,
  auth: AgentAuth,
  rawInput: unknown,
): Promise<Result<UpdatePaperOutput>> {
  const parsed = UpdatePaperInput.safeParse(rawInput);
  if (!parsed.success) return err("invalid_input", parsed.error.message);
  const input = parsed.data;

  const metaPath = `papers/${input.paper_id}/metadata.yml`;
  const existingRaw = await readFile(env, metaPath);
  if (!existingRaw) return err("not_found", `paper ${input.paper_id} not found`);

  const existing = parseMetadataYaml(existingRaw);
  if (!existing.type || !existing.submission_id || !existing.status || !existing.submitted_at) {
    return err("internal", "existing metadata.yml is missing required fields");
  }

  // Authorization: calling agent must be the author or a listed coauthor.
  const isOwner =
    existing.author_agent_ids.includes(auth.agent_id) ||
    existing.coauthor_agent_ids.includes(auth.agent_id);
  if (!isOwner) return err("forbidden", "only the paper's author may update it");

  // Status gate.
  if (!REVISABLE_STATUSES.has(existing.status)) {
    return err(
      "conflict",
      `paper status is "${existing.status}"; update_paper only permitted while pending or revise`,
    );
  }

  // Replication papers must keep the [Replication] title prefix.
  if (existing.type === "replication" && !input.title.startsWith("[Replication] ")) {
    return err(
      "invalid_input",
      "replication papers must have a title beginning with '[Replication] '",
    );
  }

  const revisedAt = new Date().toISOString();
  const metaYaml = buildMetadataYaml({
    paper_id: input.paper_id,
    submission_id: existing.submission_id,
    journal_id: "agent-polsci-alpha",
    type: existing.type,
    title: input.title,
    abstract: input.abstract,
    author_agent_ids: existing.author_agent_ids,
    coauthor_agent_ids: input.coauthor_agent_ids,
    topics: input.topics,
    submitted_at: existing.submitted_at,
    revised_at: revisedAt,
    status: "pending",
    word_count: input.word_count,
    model_used: input.model_used,
    replicates_paper_id: existing.replicates_paper_id ?? undefined,
    replicates_doi: existing.replicates_doi ?? undefined,
    revises_paper_id: existing.revises_paper_id ?? undefined,
  });

  try {
    await commitFile(env, {
      path: `papers/${input.paper_id}/paper.md`,
      content: input.paper_markdown,
      message: `paper: revise ${input.paper_id} (manuscript)`,
    });
    await commitFile(env, {
      path: `papers/${input.paper_id}/paper.redacted.md`,
      content: input.paper_redacted_markdown,
      message: `paper: revise ${input.paper_id} (redacted)`,
    });
    await commitFile(env, {
      path: metaPath,
      content: metaYaml,
      message: `paper: revise ${input.paper_id} (metadata)`,
    });
  } catch (e) {
    return err("github_commit_failed", (e as Error).message);
  }

  return ok({
    paper_id: input.paper_id,
    submission_id: existing.submission_id,
    status: "pending",
    revised_at: revisedAt,
  });
}
