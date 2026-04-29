#!/usr/bin/env tsx
// Best-effort metrics fetch from the X API for tweets we posted recently.
// Writes one JSONL row per (tweet_id, measured_at) into
// social/metrics.log.jsonl. Append-only: re-running tracks metric
// trajectories per tweet over time.
//
// THIS IS NOT THE PRIMARY DATA SOURCE. The X API free tier caps reads at
// ~100/month, which doesn't cover our cadence (~360 posts/month). The
// primary measurement path is manual analytics.x.com CSV export — see
// social/metrics/README.md. This script is a best-effort supplement: it
// runs on a 3-day cron and samples the most recent N tweets up to a hard
// 50-read-per-run budget so three monthly runs stay under the free-tier
// cap. When the API rejects (403 / out-of-plan), it exits gracefully so
// the CSV path remains the source of truth.

import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TwitterApi } from "twitter-api-v2";
import { loadCredsFromEnv } from "../src/x-client.js";
import type { PostLogEntry } from "../src/types.js";

const METRICS_LOG_RELATIVE = "social/metrics.log.jsonl";
const POSTS_LOG_RELATIVE = "social/posts.log.jsonl";
const DEFAULT_LOOKBACK_DAYS = 9;
const DEFAULT_MAX_READS = 50;
const PER_CALL_SLEEP_MS = 1100;

type MetricsRow = {
  measured_at: string;
  tweet_id: string;
  posted_at: string;
  slot: string;
  source: string;
  variant_idx: number;
  age_hours_at_measure: number;
  metrics: {
    impression_count: number;
    like_count: number;
    retweet_count: number;
    reply_count: number;
    quote_count: number;
    bookmark_count?: number;
  };
};

function parseArgs(argv: string[]): {
  repoRoot: string;
  lookbackDays: number;
  maxReads: number;
  dryRun: boolean;
} {
  let repoRoot: string | undefined;
  let lookbackDays = DEFAULT_LOOKBACK_DAYS;
  let maxReads = DEFAULT_MAX_READS;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--repo-root") repoRoot = argv[++i];
    else if (a?.startsWith("--repo-root=")) repoRoot = a.slice("--repo-root=".length);
    else if (a === "--lookback-days") lookbackDays = Number(argv[++i]);
    else if (a?.startsWith("--lookback-days=")) lookbackDays = Number(a.slice("--lookback-days=".length));
    else if (a === "--max-reads") maxReads = Number(argv[++i]);
    else if (a?.startsWith("--max-reads=")) maxReads = Number(a.slice("--max-reads=".length));
    else if (a === "--dry-run") dryRun = true;
  }
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return {
    repoRoot: resolve(repoRoot ?? join(__dirname, "..", "..")),
    lookbackDays,
    maxReads,
    dryRun,
  };
}

function readPostsInWindow(repoRoot: string, lookbackDays: number, now: Date): PostLogEntry[] {
  const path = join(repoRoot, POSTS_LOG_RELATIVE);
  if (!existsSync(path)) return [];
  const cutoff = new Date(now.getTime() - lookbackDays * 24 * 60 * 60 * 1000);
  return readFileSync(path, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l) as PostLogEntry)
    .filter((e) => new Date(e.timestamp) >= cutoff);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { repoRoot, lookbackDays, maxReads, dryRun } = parseArgs(process.argv.slice(2));
  const now = new Date();
  const allPosts = readPostsInWindow(repoRoot, lookbackDays, now);
  if (allPosts.length === 0) {
    console.log("[fetch-metrics] no posts in window; nothing to do");
    return;
  }
  // Cap to maxReads, sampling the most recent posts. Free-tier read budget
  // is the binding constraint — three runs/month should fit within the
  // ~100 reads/month cap.
  const posts = allPosts
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, maxReads);
  console.log(
    `[fetch-metrics] ${allPosts.length} posts in last ${lookbackDays}d; ` +
      `sampling ${posts.length} (cap=${maxReads}).`,
  );

  if (dryRun) {
    for (const p of posts) {
      console.log(`[dry-run] would fetch ${p.tweet_id} (slot=${p.slot}, source=${p.source}, v${p.variant_idx})`);
    }
    return;
  }

  const creds = loadCredsFromEnv();
  const client = new TwitterApi(creds);
  const metricsPath = join(repoRoot, METRICS_LOG_RELATIVE);

  let ok = 0;
  let failed = 0;
  const failures: Array<{ id: string; reason: string }> = [];
  for (const post of posts) {
    try {
      const res = await client.v2.singleTweet(post.tweet_id, {
        "tweet.fields": ["public_metrics", "created_at"],
      });
      const pm = res.data?.public_metrics;
      if (!pm) {
        failed++;
        failures.push({ id: post.tweet_id, reason: "no public_metrics in response" });
        continue;
      }
      const postedAt = res.data.created_at ?? post.timestamp;
      const ageHours = (now.getTime() - new Date(postedAt).getTime()) / 3600000;
      const row: MetricsRow = {
        measured_at: now.toISOString(),
        tweet_id: post.tweet_id,
        posted_at: postedAt,
        slot: post.slot,
        source: post.source,
        variant_idx: post.variant_idx,
        age_hours_at_measure: Math.round(ageHours * 10) / 10,
        metrics: {
          impression_count: pm.impression_count ?? 0,
          like_count: pm.like_count ?? 0,
          retweet_count: pm.retweet_count ?? 0,
          reply_count: pm.reply_count ?? 0,
          quote_count: pm.quote_count ?? 0,
          ...(typeof pm.bookmark_count === "number" ? { bookmark_count: pm.bookmark_count } : {}),
        },
      };
      appendFileSync(metricsPath, JSON.stringify(row) + "\n", "utf-8");
      ok++;
    } catch (e) {
      failed++;
      const msg = (e as Error).message ?? String(e);
      failures.push({ id: post.tweet_id, reason: msg });
      // 403 = endpoint not in plan; abort early so we don't burn the rate limit.
      if (msg.includes("403") || /not.*plan|forbidden/i.test(msg)) {
        console.error(`[fetch-metrics] X API rejected the read (likely free-tier scope).`);
        console.error(`  Falling back to the manual analytics.x.com CSV path is the next move.`);
        break;
      }
    }
    await sleep(PER_CALL_SLEEP_MS);
  }

  console.log(`[fetch-metrics] wrote ${ok} rows, ${failed} failed → ${metricsPath}`);
  if (failures.length > 0) {
    console.error(`[fetch-metrics] first failure: ${failures[0].id} — ${failures[0].reason}`);
  }
  if (ok === 0 && failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[fetch-metrics] fatal:", err);
  process.exit(1);
});
