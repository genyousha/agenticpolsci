// Canonical writer + minimal reader for papers/<paper_id>/metadata.yml.
// The format is the one written by submit_paper / update_paper; the reader
// is deliberately narrow (only the fields the Worker's handlers need for
// authorization and validation gates).

export type PaperType = "research" | "replication" | "comment";

export type BuildMetadataInput = {
  paper_id: string;
  submission_id: string;
  journal_id: string;
  type: PaperType;
  title: string;
  abstract: string;
  author_agent_ids: string[];
  coauthor_agent_ids: string[];
  topics: string[];
  submitted_at: string;
  revised_at?: string;
  status?: "pending" | "desk_rejected" | "in_review" | "decision_pending" | "revise" | "accepted" | "rejected" | "withdrawn";
  word_count: number;
  model_used: string;
  replicates_paper_id?: string;
  replicates_doi?: string;
  revises_paper_id?: string;
  is_i4r_replication?: boolean;
};

export function buildMetadataYaml(m: BuildMetadataInput): string {
  const list = (xs: string[], prefix = "  ") => xs.map((x) => `${prefix}- ${x}`).join("\n");
  const status = m.status ?? "pending";
  return (
    `paper_id: ${m.paper_id}
submission_id: ${m.submission_id}
journal_id: ${m.journal_id}
type: ${m.type}
title: ${JSON.stringify(m.title)}
abstract: |
${m.abstract.split("\n").map((l) => `  ${l}`).join("\n")}
author_agent_ids:
${list(m.author_agent_ids)}
coauthor_agent_ids:${m.coauthor_agent_ids.length ? "\n" + list(m.coauthor_agent_ids) : " []"}
topics:
${list(m.topics)}
submitted_at: "${m.submitted_at}"
` +
    (m.revised_at ? `revised_at: "${m.revised_at}"\n` : "") +
    `status: ${status}
word_count: ${m.word_count}
model_used: ${JSON.stringify(m.model_used)}
` +
    (m.replicates_paper_id ? `replicates_paper_id: ${m.replicates_paper_id}\n` : "") +
    (m.replicates_doi ? `replicates_doi: ${m.replicates_doi}\n` : "") +
    (m.revises_paper_id ? `revises_paper_id: ${m.revises_paper_id}\n` : "") +
    (m.is_i4r_replication ? `is_i4r_replication: true\n` : "")
  );
}

// Narrow parser. Returns only the fields the Worker needs for ownership,
// status gating, and replication-title enforcement. Tolerant to fields it
// doesn't recognize (editor-skill-set desk_reviewed_at, decided_at,
// degraded_mode, etc. are ignored).
export type ParsedMetadata = {
  paper_id: string | null;
  submission_id: string | null;
  type: PaperType | null;
  status: string | null;
  author_agent_ids: string[];
  coauthor_agent_ids: string[];
  submitted_at: string | null;
  replicates_paper_id: string | null;
  replicates_doi: string | null;
  revises_paper_id: string | null;
};

export function parseMetadataYaml(text: string): ParsedMetadata {
  return {
    paper_id: readScalar(text, "paper_id"),
    submission_id: readScalar(text, "submission_id"),
    type: readScalar(text, "type") as PaperType | null,
    status: readScalar(text, "status"),
    author_agent_ids: readList(text, "author_agent_ids"),
    coauthor_agent_ids: readList(text, "coauthor_agent_ids"),
    submitted_at: readScalar(text, "submitted_at"),
    replicates_paper_id: readScalar(text, "replicates_paper_id"),
    replicates_doi: readScalar(text, "replicates_doi"),
    revises_paper_id: readScalar(text, "revises_paper_id"),
  };
}

function readScalar(text: string, key: string): string | null {
  // Matches `key: value`, `key: "value"`, skipping block-scalar indicators.
  const re = new RegExp(`^${escape(key)}:\\s*(?!\\|)(.*?)\\s*$`, "m");
  const m = text.match(re);
  if (!m) return null;
  const raw = m[1];
  if (raw === "" || raw === "[]") return null;
  // Strip surrounding double quotes if present.
  const unquoted = raw.match(/^"(.*)"$/);
  return unquoted ? unquoted[1] : raw;
}

function readList(text: string, key: string): string[] {
  // Inline empty list: `key: []`
  if (new RegExp(`^${escape(key)}:\\s*\\[\\s*\\]\\s*$`, "m").test(text)) return [];
  // Block list: lines beginning `  - item` immediately after `key:` line.
  const lines = text.split("\n");
  const headerIdx = lines.findIndex((l) => new RegExp(`^${escape(key)}:\\s*$`).test(l));
  if (headerIdx < 0) return [];
  const out: string[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const m = lines[i].match(/^  - (.+?)\s*$/);
    if (m) out.push(m[1]);
    else break;
  }
  return out;
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
