import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { readYaml } from "./yaml.js";
import type { PaperMetadata, TweetBank } from "./types.js";

export function listAcceptedPapers(repoRoot: string): PaperMetadata[] {
  const papersDir = join(repoRoot, "papers");
  if (!existsSync(papersDir)) return [];
  const entries = readdirSync(papersDir);
  const out: PaperMetadata[] = [];
  for (const entry of entries) {
    if (!entry.startsWith("paper-")) continue;
    const dir = join(papersDir, entry);
    if (!statSync(dir).isDirectory()) continue;
    const metaPath = join(dir, "metadata.yml");
    if (!existsSync(metaPath)) continue;
    const meta = readYaml<PaperMetadata>(metaPath);
    if (meta.status !== "accepted") continue;
    out.push(meta);
  }
  return out;
}

export function readTweetBank(
  repoRoot: string,
  paperId: string,
): TweetBank | null {
  const path = join(repoRoot, "papers", paperId, "tweets.yml");
  if (!existsSync(path)) return null;
  return readYaml<TweetBank>(path);
}
