import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { readYaml } from "../lib/yaml.js";

export type NotifyBatchItem =
  | { kind: "reviewer_assignment"; paper_id: string; review_id: string; reviewer_agent_id: string; due_at: string }
  | { kind: "decision"; paper_id: string; outcome: "accept" | "accept_with_revisions" | "major_revisions" | "reject"; author_agent_ids: string[] }
  | { kind: "desk_reject"; paper_id: string; author_agent_ids: string[] }
  | { kind: "revision_request"; paper_id: string; author_agent_ids: string[] };

export type NotifyBatch = { items: NotifyBatchItem[] };

export type NotifySummary = {
  sent: number;
  skipped_dedupe: number;
  failed: Array<{ kind: string; target_id: string; recipient_user_id: string | null; reason: string }>;
};

type PaperMeta = {
  paper_id: string;
  status: string;
  author_agent_ids: string[];
  coauthor_agent_ids?: string[];
  revises_paper_id?: string;
};

type DecisionFM = {
  paper_id: string;
  outcome: "accept" | "accept_with_revisions" | "major_revisions" | "reject" | "desk_reject";
};

export function buildNotifyBatch(publicRepoPath: string): NotifyBatch {
  const papersDir = join(publicRepoPath, "papers");
  const items: NotifyBatchItem[] = [];
  if (!existsSync(papersDir)) return { items };

  const paperIds = readdirSync(papersDir).filter((f) => {
    const p = join(papersDir, f);
    return statSync(p).isDirectory() && f.startsWith("paper-");
  });

  const metas = new Map<string, PaperMeta>();
  for (const pid of paperIds) {
    const metaPath = join(papersDir, pid, "metadata.yml");
    if (!existsSync(metaPath)) continue;
    const meta = readYaml<PaperMeta>(metaPath);
    metas.set(pid, meta);
  }
  const supersededBy = new Set<string>();
  for (const meta of metas.values()) {
    if (meta.revises_paper_id) supersededBy.add(meta.revises_paper_id);
  }

  for (const [pid, meta] of metas) {
    const reviewsDir = join(papersDir, pid, "reviews");
    if (existsSync(reviewsDir)) {
      for (const f of readdirSync(reviewsDir)) {
        if (!f.endsWith(".invitation.yml")) continue;
        const inv = readYaml<{
          review_id: string;
          paper_id: string;
          reviewer_agent_id: string;
          due_at?: string;
          status: string;
        }>(join(reviewsDir, f));
        if (inv.status !== "pending") continue;
        items.push({
          kind: "reviewer_assignment",
          paper_id: inv.paper_id,
          review_id: inv.review_id,
          reviewer_agent_id: inv.reviewer_agent_id,
          due_at: inv.due_at ?? "",
        });
      }
    }

    const decisionPath = join(papersDir, pid, "decision.md");
    if (!existsSync(decisionPath)) continue;
    const fm = readDecisionFrontmatter(decisionPath);
    if (!fm) continue;
    const authors = [
      ...(meta.author_agent_ids ?? []),
      ...(meta.coauthor_agent_ids ?? []),
    ];
    if (authors.length === 0) continue;

    if (fm.outcome === "desk_reject") {
      items.push({ kind: "desk_reject", paper_id: pid, author_agent_ids: authors });
      continue;
    }

    items.push({
      kind: "decision",
      paper_id: pid,
      outcome: fm.outcome,
      author_agent_ids: authors,
    });

    if (
      (fm.outcome === "accept_with_revisions" || fm.outcome === "major_revisions") &&
      !supersededBy.has(pid)
    ) {
      items.push({ kind: "revision_request", paper_id: pid, author_agent_ids: authors });
    }
  }

  return { items };
}

function readDecisionFrontmatter(decisionPath: string): DecisionFM | null {
  const raw = readFileSync(decisionPath, "utf-8");
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const lines = match[1].split("\n");
  const out: Record<string, string> = {};
  for (const line of lines) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^"|"$/g, "");
  }
  if (!out.paper_id || !out.outcome) return null;
  return { paper_id: out.paper_id, outcome: out.outcome as DecisionFM["outcome"] };
}

export type PostNotifyInput = {
  workerUrl: string;
  operatorToken: string;
  batch: NotifyBatch;
  fetcher?: typeof fetch;
};
export type PostNotifyResult =
  | { ok: true; summary: NotifySummary }
  | { ok: false; reason: string };

export async function postNotify(input: PostNotifyInput): Promise<PostNotifyResult> {
  const f = input.fetcher ?? fetch;
  const url = input.workerUrl.replace(/\/$/, "") + "/v1/internal/notify";
  try {
    const res = await f(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.operatorToken}`,
      },
      body: JSON.stringify(input.batch),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, reason: `worker_error: ${res.status} ${body}`.trim() };
    }
    const summary = (await res.json()) as NotifySummary;
    return { ok: true, summary };
  } catch (e) {
    return { ok: false, reason: `network_error: ${(e as Error).message}` };
  }
}
