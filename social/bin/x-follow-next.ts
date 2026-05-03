#!/usr/bin/env tsx
/**
 * Follow the next N handles from social/follow-strategy.md that aren't
 * already in social/follows.log.jsonl. Hard daily cap, jitter between
 * actions, abort on captcha or login wall.
 *
 * Usage:
 *   npm run x:follow-next                # follow 1
 *   npm run x:follow-next -- --count 3   # follow up to 3
 *   npm run x:follow-next -- --dry-run   # show plan, don't click
 */
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import {
  openXSession,
  detectBlockingChallenge,
  jitterSleep,
  statePath,
} from "../src/x-browser/session.js";
import { readStrategyQueue } from "../src/x-browser/strategy-parser.js";
import {
  appendFollowLogEntry,
  readFollowLog,
  followedHandles,
  followsToday,
  DAILY_FOLLOW_CAP,
  type FollowLogEntry,
} from "../src/x-browser/follow-log.js";

const repoRoot = resolve(process.cwd(), "..");

type Args = { count: number; dryRun: boolean };
function parseArgs(argv: string[]): Args {
  let count = 1;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--count" || a === "-n") count = Math.max(1, Number(argv[++i] ?? "1"));
    else if (a === "--dry-run") dryRun = true;
  }
  return { count, dryRun };
}

async function main() {
  const { count, dryRun } = parseArgs(process.argv.slice(2));

  const queue = readStrategyQueue(repoRoot);
  const log = readFollowLog(repoRoot);
  const done = followedHandles(log);
  const todayCount = followsToday(log);
  const remainingToday = Math.max(0, DAILY_FOLLOW_CAP - todayCount);

  if (remainingToday === 0) {
    console.log(
      `Daily cap reached: ${todayCount}/${DAILY_FOLLOW_CAP} follows already today. Try again tomorrow.`,
    );
    return;
  }

  const want = Math.min(count, remainingToday);
  const toFollow = queue
    .filter((e) => !done.has(e.handle.toLowerCase()))
    .slice(0, want);

  if (toFollow.length === 0) {
    console.log("Strategy queue exhausted — every entry already in follow log.");
    return;
  }

  console.log(`Plan (${toFollow.length}/${want}, today ${todayCount}/${DAILY_FOLLOW_CAP}):`);
  for (const e of toFollow) {
    console.log(`  Day ${e.day} #${e.order}  @${e.handle}  — ${e.reason}`);
  }

  if (dryRun) {
    console.log("--dry-run: not opening browser.");
    return;
  }

  if (!existsSync(statePath(repoRoot))) {
    console.error(
      `No saved session at ${statePath(repoRoot)}. Run \`npm run x:login\` first.`,
    );
    process.exit(1);
  }

  const session = await openXSession(repoRoot, { headless: false });
  let followedThisRun = 0;

  try {
    for (let i = 0; i < toFollow.length; i++) {
      const entry = toFollow[i]!;
      const handle = entry.handle;
      const url = `https://x.com/${handle}`;
      console.log(`\n[${i + 1}/${toFollow.length}] @${handle} → ${url}`);

      await session.page.goto(url, { waitUntil: "domcontentloaded" });
      await jitterSleep(2500, 5500);

      const challenge = await detectBlockingChallenge(session.page);
      if (challenge.blocked) {
        const result: FollowLogEntry = {
          timestamp: new Date().toISOString(),
          handle,
          result: "skipped_captcha",
          note: challenge.reason,
        };
        appendFollowLogEntry(repoRoot, result);
        console.error(`ABORT: ${challenge.reason}. Session saved; resolve manually.`);
        break;
      }

      // Scope to THIS handle so we don't grab a "Who to follow" rec by mistake.
      // X's aria-labels are case-preserving; match case-insensitively via i flag.
      const followBtn = session.page.locator(
        `button[aria-label="Follow @${handle}" i]`,
      );
      const followingBtn = session.page.locator(
        `button[aria-label="Following @${handle}" i]`,
      );

      // Wait until either button appears (or 12s) — XHR-rendered, not in initial HTML.
      await session.page
        .waitForSelector(
          `button[aria-label="Follow @${handle}" i], button[aria-label="Following @${handle}" i]`,
          { timeout: 12000 },
        )
        .catch(() => {});

      const isAlreadyFollowing =
        (await followingBtn.first().count().catch(() => 0)) > 0;
      if (isAlreadyFollowing) {
        appendFollowLogEntry(repoRoot, {
          timestamp: new Date().toISOString(),
          handle,
          result: "already_following",
        });
        console.log(`  already following @${handle}, logged.`);
        await jitterSleep(3000, 7000);
        continue;
      }

      const btnCount = await followBtn.first().count().catch(() => 0);
      if (btnCount === 0) {
        appendFollowLogEntry(repoRoot, {
          timestamp: new Date().toISOString(),
          handle,
          result: "failed",
          note: "Follow button not found (suspended? renamed? page broken?)",
        });
        console.warn(`  no Follow button on @${handle} page — skipped.`);
        await jitterSleep(3000, 7000);
        continue;
      }

      await followBtn.first().scrollIntoViewIfNeeded().catch(() => {});
      await jitterSleep(800, 1800);
      await followBtn.first().click();

      // Confirm the button flipped to Following within ~5s.
      let flipped = false;
      const flipDeadline = Date.now() + 5000;
      while (Date.now() < flipDeadline) {
        await new Promise((r) => setTimeout(r, 300));
        if ((await followingBtn.first().count().catch(() => 0)) > 0) {
          flipped = true;
          break;
        }
      }

      if (flipped) {
        appendFollowLogEntry(repoRoot, {
          timestamp: new Date().toISOString(),
          handle,
          result: "followed",
        });
        followedThisRun++;
        console.log(`  ✓ followed @${handle}`);
      } else {
        appendFollowLogEntry(repoRoot, {
          timestamp: new Date().toISOString(),
          handle,
          result: "failed",
          note: "click did not flip button to Following within 5s",
        });
        console.warn(`  ✗ click on @${handle} did not register; logged as failed.`);
      }

      // Persist state in case cookies refreshed.
      await session.saveState();

      // Jitter between accounts unless this is the last one.
      if (i < toFollow.length - 1) {
        const min = 30_000;
        const max = 180_000;
        const ms = Math.floor(min + Math.random() * (max - min));
        console.log(`  sleeping ${(ms / 1000).toFixed(0)}s before next…`);
        await new Promise((r) => setTimeout(r, ms));
      }
    }
  } finally {
    await session.close();
  }

  console.log(
    `\nDone. Followed ${followedThisRun} this run. Today total: ${
      todayCount + followedThisRun
    }/${DAILY_FOLLOW_CAP}.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
