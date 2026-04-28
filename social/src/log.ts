import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { POSTS_LOG_READ_DAYS } from "./constants.js";
import type { PostLogEntry } from "./types.js";

const LOG_RELATIVE_PATH = "social/posts.log.jsonl";

export function readPostsLog(
  repoRoot: string,
  now: Date = new Date(),
): PostLogEntry[] {
  const path = join(repoRoot, LOG_RELATIVE_PATH);
  if (!existsSync(path)) return [];
  const text = readFileSync(path, "utf-8");
  const cutoff = new Date(
    now.getTime() - POSTS_LOG_READ_DAYS * 24 * 60 * 60 * 1000,
  );
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l) as PostLogEntry)
    .filter((e) => new Date(e.timestamp) >= cutoff);
}

export function appendPostLogEntry(
  repoRoot: string,
  entry: PostLogEntry,
): void {
  const path = join(repoRoot, LOG_RELATIVE_PATH);
  appendFileSync(path, JSON.stringify(entry) + "\n", "utf-8");
}

export function logPathRelative(): string {
  return LOG_RELATIVE_PATH;
}
