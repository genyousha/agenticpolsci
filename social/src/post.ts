import { existsSync } from "node:fs";
import { join } from "node:path";
import { listAcceptedPapers, readTweetBank } from "./papers.js";
import { readPostsLog, appendPostLogEntry } from "./log.js";
import { selectForSlot } from "./select.js";
import { composeMainTweet, composeReplyBody } from "./compose.js";
import { renderPaperThumbnail, renderSiteThumbnail } from "./render-thumbnail.js";
import {
  DOUBLE_FIRE_GUARD_SECONDS,
  SITE_BASE_URL,
} from "./constants.js";
import type {
  PaperMetadata,
  PostLogEntry,
  Slot,
  SiteTweetBank,
} from "./types.js";
import type { XClient } from "./x-client.js";
import { readYaml } from "./yaml.js";

export type RunPostArgs = {
  slot: Slot;
  repoRoot: string;
  client: XClient;
  now: Date;
  dryRun: boolean;
};

export async function runPost(args: RunPostArgs): Promise<void> {
  const log = readPostsLog(args.repoRoot, args.now);

  // Double-fire guard.
  const guardCutoff = new Date(
    args.now.getTime() - DOUBLE_FIRE_GUARD_SECONDS * 1000,
  );
  if (log.some((e) => new Date(e.timestamp) >= guardCutoff)) {
    console.error(
      `[social/post] double-fire guard: a post happened in the last ${DOUBLE_FIRE_GUARD_SECONDS}s, skipping.`,
    );
    return;
  }

  const allPapers = listAcceptedPapers(args.repoRoot);

  // Site bank
  const siteBankPath = join(args.repoRoot, "site", "tweets.yml");
  if (!existsSync(siteBankPath)) {
    throw new Error(`site/tweets.yml missing at ${siteBankPath}`);
  }
  const siteBank = readYaml<SiteTweetBank>(siteBankPath);

  // Drop accepted papers that have no tweets.yml — they're not eligible
  // until the editor backfills.
  const eligiblePapers: PaperMetadata[] = [];
  for (const p of allPapers) {
    if (readTweetBank(args.repoRoot, p.paper_id)) {
      eligiblePapers.push(p);
    } else {
      console.error(
        `[social/post] skipping ${p.paper_id}: no tweets.yml (run editor backfill).`,
      );
    }
  }

  const paperVariantCounts: Record<string, number> = {};
  for (const p of eligiblePapers) {
    const bank = readTweetBank(args.repoRoot, p.paper_id);
    if (bank) paperVariantCounts[p.paper_id] = bank.variants.length;
  }

  const selection = selectForSlot({
    slot: args.slot,
    papers: eligiblePapers,
    log,
    siteVariantCount: siteBank.variants.length,
    paperVariantCounts,
    now: args.now,
  });

  // Resolve selection → (variantText, paperMeta?)
  let variantText: string;
  let paperMeta: PaperMetadata | null = null;
  if (selection.source === "site") {
    variantText = siteBank.variants[selection.variantIdx]!;
  } else {
    paperMeta = eligiblePapers.find((p) => p.paper_id === selection.source)!;
    const bank = readTweetBank(args.repoRoot, paperMeta.paper_id)!;
    variantText = bank.variants[selection.variantIdx]!;
  }

  const url =
    paperMeta === null
      ? `${SITE_BASE_URL}/`
      : `${SITE_BASE_URL}/papers/${paperMeta.paper_id}/`;
  // Title is intentionally NOT in the main tweet body. It's already shown:
  //   (a) on the 1200×675 OG image attached to the main tweet, and
  //   (b) on the OG link card auto-rendered on the URL self-reply.
  // Including it in the text caused 280-char tweets ending with truncated
  // mid-word "…" that X's anti-spam filter rejected with 403 "not
  // permitted to perform this action" on this brand-new account.
  const topics = paperMeta?.topics ?? [];

  const mainText = composeMainTweet({
    variant: variantText,
    title: "",
    topics,
  });
  const replyText = composeReplyBody({ url });

  const png = paperMeta
    ? await renderPaperThumbnail(paperMeta)
    : await renderSiteThumbnail();

  if (args.dryRun) {
    console.log(`[dry-run] main (${mainText.length}/280): ${mainText}`);
    console.log(`[dry-run] reply (${replyText.length}/280): ${replyText}`);
    console.log(`[dry-run] thumbnail bytes: ${png.length}`);
    console.log(`[dry-run] selection: ${JSON.stringify(selection)}`);
    return;
  }

  const mediaId = await args.client.uploadMedia(png);
  const tweet = await args.client.postTweet(mainText, mediaId);

  // Self-reply with the URL. X auto-renders the OG card on the reply, so
  // the link is one tap away with full preview. Per STRATEGY.md rule A-4,
  // this is the link-in-self-reply pattern that recovers reach lost to
  // the free-tier link penalty.
  //
  // Failure of the reply MUST NOT roll back the main tweet — the main is
  // the irreversible side effect. We log a warning, write the log entry
  // without reply_tweet_id, and let /restrategize-x flag the gap.
  let replyTweetId: string | undefined;
  try {
    const reply = await args.client.postReply(replyText, tweet.id);
    replyTweetId = reply.id;
  } catch (e) {
    console.error(
      `[social/post] WARNING: main tweet ${tweet.id} posted but self-reply failed: ${(e as Error).message}`,
    );
  }

  const entry: PostLogEntry = {
    timestamp: args.now.toISOString(),
    slot: args.slot,
    source: selection.source,
    variant_idx: selection.variantIdx,
    tweet_id: tweet.id,
    tweet_url: tweet.url,
    ...(replyTweetId ? { reply_tweet_id: replyTweetId } : {}),
    ...(selection.degraded ? { degraded: true } : {}),
    ...(selection.degraded_reason
      ? { degraded_reason: selection.degraded_reason }
      : {}),
  };
  appendPostLogEntry(args.repoRoot, entry);

  console.log(
    `[social/post] posted ${entry.slot} (${entry.source} v${entry.variant_idx}) → ${entry.tweet_url}` +
      (replyTweetId ? ` (+self-reply ${replyTweetId})` : " (self-reply FAILED)"),
  );
}
