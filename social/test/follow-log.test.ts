import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  appendFollowLogEntry,
  followLogPath,
  readFollowLog,
  followedHandles,
  followsToday,
  DAILY_FOLLOW_CAP,
} from "../src/x-browser/follow-log.js";

function makeTmpRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "follow-log-"));
  mkdirSync(join(root, "social"), { recursive: true });
  return root;
}

describe("follow log", () => {
  it("returns [] when log missing", () => {
    expect(readFollowLog(makeTmpRepo())).toEqual([]);
  });

  it("appends and reads JSONL entries", () => {
    const root = makeTmpRepo();
    appendFollowLogEntry(root, {
      timestamp: "2026-05-03T09:00:00Z",
      handle: "b_m_stewart",
      result: "followed",
    });
    appendFollowLogEntry(root, {
      timestamp: "2026-05-03T09:30:00Z",
      handle: "chris_bail",
      result: "already_following",
    });
    const entries = readFollowLog(root);
    expect(entries).toHaveLength(2);
    expect(entries[0]!.handle).toBe("b_m_stewart");
    const file = readFileSync(followLogPath(root), "utf-8");
    expect(file.split("\n").filter((l) => l.length > 0)).toHaveLength(2);
  });

  it("followedHandles includes followed + already_following, excludes failures", () => {
    const set = followedHandles([
      { timestamp: "t", handle: "a", result: "followed" },
      { timestamp: "t", handle: "B", result: "already_following" },
      { timestamp: "t", handle: "c", result: "skipped_captcha" },
      { timestamp: "t", handle: "d", result: "failed" },
    ]);
    expect(set.has("a")).toBe(true);
    expect(set.has("b")).toBe(true);
    expect(set.has("c")).toBe(false);
    expect(set.has("d")).toBe(false);
  });

  it("followsToday counts only successful clicks on the same UTC day", () => {
    const entries = [
      { timestamp: "2026-05-03T01:00:00Z", handle: "x", result: "followed" as const },
      { timestamp: "2026-05-03T23:00:00Z", handle: "y", result: "followed" as const },
      { timestamp: "2026-05-03T12:00:00Z", handle: "z", result: "already_following" as const },
      { timestamp: "2026-05-02T23:00:00Z", handle: "w", result: "followed" as const },
    ];
    expect(followsToday(entries, new Date("2026-05-03T15:00:00Z"))).toBe(2);
  });

  it("DAILY_FOLLOW_CAP stays under the documented STRATEGY.md cap", () => {
    expect(DAILY_FOLLOW_CAP).toBeLessThanOrEqual(12);
  });
});
