import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runPost } from "../src/post.js";
import { FakeXClient } from "../src/x-client.js";

function makeRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "social-post-"));
  mkdirSync(join(root, "social"), { recursive: true });
  mkdirSync(join(root, "site"), { recursive: true });
  writeFileSync(join(root, "social/posts.log.jsonl"), "");
  return root;
}

function writeSiteBank(root: string, count = 25): void {
  const variants = Array.from(
    { length: count },
    (_, i) => `Site promo variant number ${i} with enough characters to pass schema.`,
  );
  const yaml = [
    `generated_at: "2026-04-28T00:00:00Z"`,
    `generated_by_model: "human"`,
    `variants:`,
    ...variants.map((v) => `  - "${v}"`),
  ].join("\n");
  writeFileSync(join(root, "site/tweets.yml"), yaml);
}

describe("runPost", () => {
  it("posts a site_promo tweet + self-reply with the URL and appends a log line with both ids", async () => {
    const root = makeRepo();
    writeSiteBank(root);
    const fake = new FakeXClient();

    await runPost({
      slot: "site_promo",
      repoRoot: root,
      client: fake,
      now: new Date("2026-04-28T09:00:00Z"),
      dryRun: false,
    });

    expect(fake.uploadedMedia).toHaveLength(1);
    expect(fake.posted).toHaveLength(1);
    expect(fake.posted[0]!.mediaId).toBe("fake-media-1");
    expect(fake.posted[0]!.text).not.toMatch(/https?:\/\//);

    expect(fake.replies).toHaveLength(1);
    expect(fake.replies[0]!.text).toMatch(/^https?:\/\//);
    // FakeXClient mints sequential IDs starting at 1000; first post → 1000.
    expect(fake.replies[0]!.inReplyToTweetId).toBe("1000");

    const log = readFileSync(join(root, "social/posts.log.jsonl"), "utf-8");
    const lines = log.split("\n").filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const entry = JSON.parse(lines[0]!);
    expect(entry.slot).toBe("site_promo");
    expect(entry.source).toBe("site");
    expect(entry.tweet_id).toMatch(/^\d+$/);
    expect(entry.reply_tweet_id).toMatch(/^\d+$/);
    expect(entry.reply_tweet_id).not.toBe(entry.tweet_id);
  });

  it("logs without reply_tweet_id when the self-reply post fails", async () => {
    const root = makeRepo();
    writeSiteBank(root);
    const fake = new FakeXClient();
    fake.failReplies = true;

    await runPost({
      slot: "site_promo",
      repoRoot: root,
      client: fake,
      now: new Date("2026-04-28T09:00:00Z"),
      dryRun: false,
    });

    // Main tweet still posted.
    expect(fake.posted).toHaveLength(1);
    expect(fake.replies).toHaveLength(0);

    const entry = JSON.parse(
      readFileSync(join(root, "social/posts.log.jsonl"), "utf-8")
        .split("\n")
        .filter((l) => l.length > 0)[0]!,
    );
    expect(entry.tweet_id).toMatch(/^\d+$/);
    expect(entry.reply_tweet_id).toBeUndefined();
  });

  it("dry-run does not call X or write log", async () => {
    const root = makeRepo();
    writeSiteBank(root);
    const fake = new FakeXClient();

    await runPost({
      slot: "site_promo",
      repoRoot: root,
      client: fake,
      now: new Date("2026-04-28T09:00:00Z"),
      dryRun: true,
    });

    expect(fake.posted).toHaveLength(0);
    const log = readFileSync(join(root, "social/posts.log.jsonl"), "utf-8");
    expect(log).toBe("");
  });

  it("double-fire guard: skips if a post happened in the last 30s", async () => {
    const root = makeRepo();
    writeSiteBank(root);
    writeFileSync(
      join(root, "social/posts.log.jsonl"),
      JSON.stringify({
        timestamp: "2026-04-28T08:59:50Z",
        slot: "site_promo",
        source: "site",
        variant_idx: 0,
        tweet_id: "1",
        tweet_url: "https://x.com/x/status/1",
      }) + "\n",
    );
    const fake = new FakeXClient();

    await runPost({
      slot: "site_promo",
      repoRoot: root,
      client: fake,
      now: new Date("2026-04-28T09:00:00Z"), // 10s after last post
      dryRun: false,
    });

    expect(fake.posted).toHaveLength(0);
  });

  it("skips paper without tweets.yml and degrades", async () => {
    const root = makeRepo();
    writeSiteBank(root);
    // accepted paper but no tweets.yml
    mkdirSync(join(root, "papers/paper-2026-9001"), { recursive: true });
    writeFileSync(
      join(root, "papers/paper-2026-9001/metadata.yml"),
      [
        "paper_id: paper-2026-9001",
        'title: "x"',
        "status: accepted",
        'decided_at: "2026-04-27T12:00:00Z"',
        "author_agent_ids: [agent-x]",
      ].join("\n"),
    );
    const fake = new FakeXClient();

    // newest slot would pick paper-9001 but it lacks a bank → degrade.
    await runPost({
      slot: "newest",
      repoRoot: root,
      client: fake,
      now: new Date("2026-04-28T12:00:00Z"),
      dryRun: false,
    });

    expect(fake.posted).toHaveLength(1);
    const entry = JSON.parse(
      readFileSync(join(root, "social/posts.log.jsonl"), "utf-8")
        .split("\n")
        .filter((l) => l.length > 0)[0]!,
    );
    expect(entry.source).toBe("site");
    expect(entry.degraded).toBe(true);
  });
});
