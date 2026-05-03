import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

export type FollowLogEntry = {
  timestamp: string;
  handle: string;
  /**
   * Result of the click attempt. "followed" = button changed to Following.
   * "already_following" = button was already Following on page load.
   * "skipped_captcha" = aborted before clicking due to captcha/login wall.
   * "failed" = click happened but button state did not flip.
   */
  result: "followed" | "already_following" | "skipped_captcha" | "failed";
  note?: string;
};

const LOG_RELATIVE_PATH = "social/follows.log.jsonl";

// Hard cap derived from STRATEGY.md: ≤12/day documented, lane-C narrows to 8/day
// to stay well clear of the 50/day shadowban trigger.
export const DAILY_FOLLOW_CAP = 8;

export function followLogPath(repoRoot: string): string {
  return join(repoRoot, LOG_RELATIVE_PATH);
}

export function readFollowLog(repoRoot: string): FollowLogEntry[] {
  const path = followLogPath(repoRoot);
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l) as FollowLogEntry);
}

export function appendFollowLogEntry(
  repoRoot: string,
  entry: FollowLogEntry,
): void {
  appendFileSync(followLogPath(repoRoot), JSON.stringify(entry) + "\n", "utf-8");
}

/**
 * Lowercased set of handles already followed (or known to be following).
 * `skipped_captcha` and `failed` are excluded so the queue retries them.
 */
export function followedHandles(entries: FollowLogEntry[]): Set<string> {
  const out = new Set<string>();
  for (const e of entries) {
    if (e.result === "followed" || e.result === "already_following") {
      out.add(e.handle.toLowerCase());
    }
  }
  return out;
}

/**
 * Count of successful follow clicks in the calendar day of `now` (UTC).
 * `already_following` does not count — no click happened.
 */
export function followsToday(
  entries: FollowLogEntry[],
  now: Date = new Date(),
): number {
  const yyyymmdd = now.toISOString().slice(0, 10);
  return entries.filter(
    (e) => e.result === "followed" && e.timestamp.startsWith(yyyymmdd),
  ).length;
}
