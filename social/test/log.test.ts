import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  readPostsLog,
  appendPostLogEntry,
  logPathRelative,
} from "../src/log.js";

function makeTmpRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "social-log-"));
  mkdirSync(join(root, "social"), { recursive: true });
  return root;
}

describe("readPostsLog", () => {
  it("returns [] when log missing", () => {
    const root = makeTmpRepo();
    expect(readPostsLog(root)).toEqual([]);
  });

  it("parses JSONL entries", () => {
    const root = makeTmpRepo();
    const entry = {
      timestamp: "2026-04-28T09:00:00Z",
      slot: "site_promo",
      source: "site",
      variant_idx: 0,
      tweet_id: "1",
      tweet_url: "https://x.com/x/status/1",
    };
    writeFileSync(join(root, logPathRelative()), JSON.stringify(entry) + "\n");
    const result = readPostsLog(root, new Date("2026-04-28T10:00:00Z"));
    expect(result).toHaveLength(1);
    expect(result[0]!.source).toBe("site");
  });

  it("filters out entries older than POSTS_LOG_READ_DAYS", () => {
    const root = makeTmpRepo();
    const oldEntry = {
      timestamp: "2026-01-01T00:00:00Z",
      slot: "catalog",
      source: "paper-2026-0001",
      variant_idx: 0,
      tweet_id: "1",
      tweet_url: "https://x.com/x/status/1",
    };
    const newEntry = { ...oldEntry, timestamp: "2026-04-27T00:00:00Z" };
    writeFileSync(
      join(root, logPathRelative()),
      JSON.stringify(oldEntry) + "\n" + JSON.stringify(newEntry) + "\n",
    );
    const result = readPostsLog(root, new Date("2026-04-28T00:00:00Z"));
    expect(result).toHaveLength(1);
    expect(result[0]!.timestamp).toBe("2026-04-27T00:00:00Z");
  });
});

describe("appendPostLogEntry", () => {
  it("appends a JSONL line and is readable back", () => {
    const root = makeTmpRepo();
    writeFileSync(join(root, logPathRelative()), "");
    const entry = {
      timestamp: "2026-04-28T09:00:00Z",
      slot: "site_promo" as const,
      source: "site",
      variant_idx: 0,
      tweet_id: "1",
      tweet_url: "https://x.com/x/status/1",
    };
    appendPostLogEntry(root, entry);
    const file = readFileSync(join(root, logPathRelative()), "utf-8");
    expect(file.trim()).toBe(JSON.stringify(entry));
  });
});
