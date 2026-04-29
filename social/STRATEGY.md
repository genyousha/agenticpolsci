# X organic-growth strategy — @genyousha_lab

This file is the single source of truth that every tweet-writing or
tweet-editing context should read. Two sections:

- **Durable principles** — manually authored from outside research (X
  open-sourced algorithm code, Buffer empirical studies, peer-reviewed
  academic-migration studies). Rarely edited.
- **Current learnings** — auto-rewritten by `/restrategize-x` every ~3
  days from the latest performance data. Treats the recent post log as
  evidence and updates what's working / what's not for *this specific
  account*.

When generating or editing tweets, apply principles first, then layer the
current learnings on top.

---

## Durable principles

### A. The 8 rules of writing one tweet

Apply these to every variant in `papers/<id>/tweets.yml` and `site/tweets.yml`.

1. **Hook in ≤100 characters.** Short hooks get ~17% higher engagement
   in aggregator data. Save the long body for the thread / self-reply.
2. **Lead with a claim or a number, not a meta-frame.** Anti-patterns:
   "Excited to share…", "Just published…", "New paper —". Use "Most
   political scientists assume X. This paper says…" or "3 reasons this
   paper would have been desk-rejected at APSR." Number-first and
   claim-first openers consistently outperform question-hooks.
3. **End with a real question — one a reader could answer.** Replies
   are weighted ~13.5x by the heavy ranker; reply-then-author-replies
   chains are weighted ~75x (X open-source algorithm constants, 2023).
   A like is worth 0.5. A single substantive exchange is worth ~150 likes.
4. **Never include the paper/site URL in the main tweet.** External
   links in the main tweet zero out median engagement on free-tier
   accounts (Buffer n=18.8M, 2024–2025). The pipeline now enforces
   this — `composeMainTweet` excludes URLs and `composeReplyBody`
   posts the URL as a self-reply where the OG card auto-renders.
   When you write a variant: it must read as a complete, compelling
   thought without any link, because that's how readers see it in the
   feed.
5. **Vary opening structure across the bank.** Two variants opening with
   "AI agents just…" is a duplicate-content flag. The bank exists to
   avoid X's copypasta filter — every variant must open differently.
6. **Plain ASCII / common Unicode. No emojis. ≤1 hashtag if any.**
   Hashtags are not the discovery channel anymore (SimClusters / TwHIN
   embeddings are); they're a topic tag at most. Multiple hashtags read
   as spam.
7. **No hype words ever.** "Groundbreaking", "revolutionary", "game-
   changing", "must-read", "🧵", "(thread)". These flag bot-pattern
   and sandbag the ranker.
8. **One precise number, figure, or proper noun in every variant.**
   "Across 31 robustness regressions" beats "across many specifications".
   "Trumps the −0.122 headline" beats "changes the result". Specificity
   is the closest thing to a free reach lever we have.

### A.bis I4R replication papers — convergence first

Only applies when the paper has `is_i4r_replication: true` in its
metadata and ships an `i4r-comparison.md`. For these papers,
convergence with the human-led Institute for Replication team is the
single most credibility-building angle: two independent replications
(one AI agent, one human team) reaching the same conclusion is direct
evidence the finding survives independent test. Bury this and you
bury the most defensible part of the story.

When generating or editing variants for an I4R paper:

- **At least 3 of the 10 variants lead with convergence** — what both
  the agent and the I4R team independently found. Source: Section 1
  of `papers/<id>/i4r-comparison.md`.
- **At least 2 variants highlight agent-only findings** that the I4R
  team missed — the methodological case for AI replication
  complementing human replication. Source: Section 2.
- **At most 1 variant** may mention I4R-only findings the agent
  missed. Honesty is on-brand; don't lead with weakness.
- Name the I4R team / DP number ("Yang & Huang's I4R DP127", etc.)
  when it adds credibility. Frame I4R explicitly as "the human-led
  replication team" or "Institute for Replication" the first time it
  appears in a variant — not all readers will know what I4R is.

### B. The 4 rules of the bank as a whole

Apply when generating the full set of 10 variants for a paper.

1. **Every variant opens differently.** No two variants share the first
   3 words. The auto-poster rotates through the bank; X's duplicate-
   content policy excludes near-identical content from search/trends
   and removes it from non-follower recommendations.
2. **At least one variant is a question.** Used sparingly per (A-2)
   above, but the auto-poster needs at least one in the bank for slots
   where a question fits the moment. Avoid three or more.
3. **At least one variant is a methodology hook** (for replication
   papers: "How do you reproduce X with Y, Z?"). At least one is a
   substantive-finding hook. At least one is a what-if / counterintuitive
   hook. At least one is a one-line takeaway.
4. **Length distribution: ~3 short (60–100 chars), ~5 medium (140–200
   chars), ~2 long (240–270 chars).** This gives the post pipeline
   flexibility for hashtag / title / URL appending without losing the
   short-hook variants to the 280 cap.

### C. Posting cadence and timing

The auto-poster fires 4 origin posts/day Mon–Fri at 9am, 10am, 1pm,
5pm ET (the high-engagement windows per Buffer n=8.7M: Tue 9am, Wed
9–10am ET; Saturday is the worst day; weekends underperform overall).
Each origin post is paired with a self-reply carrying the URL. The
configuration lives in `.github/workflows/x-post.yml`.

**First 30 minutes after posting** is when the heavy ranker decides
whether to expand reach. If anyone (operator or scheduled session) can be
ready to seed substantive replies in that window, do it.

### D. What the X algorithm rewards (engagement weights from open-source code, 2023)

| Action | Weight |
|---|---|
| Reply that author then replies to | **+75** |
| Profile click + engage | **+12** |
| Good click | **+11** |
| Reply | **+13.5** |
| Bookmark | **~+10** |
| Retweet | **+1** |
| Like | **+0.5** |
| Negative feedback (mute/block/hide) | **−74** |
| Report | **−369** |

Implication: a single back-and-forth with the OP is worth ~150 likes.
Avoid anything that risks a report (−369 = ~700 likes lost). The cost of
sounding bot-like (mute/block) is enormous because the algorithm reads it
as `−148 like-equivalents` per occurrence.

### E. Anti-patterns the algorithm explicitly punishes

- External links in the main tweet (Buffer 2025: median engagement = 0%
  for free-tier link posts).
- Identical or near-identical content across days (X copypasta policy:
  excluded from search/trends, removed from non-follower recs).
- Multiple links + multiple hashtags → automated-spam filter.
- Posting frequency past 5/day → engagement rate per post collapses,
  drags TweepCred score down.
- Bot-pattern openers ("Just published: [title] — read here").
- Replies received but never engaged-by-author → forfeits the 75-weight
  signal. If we can't respond, don't ask questions.

### F. Pipeline gaps — known, surfaced

Resolved gaps are kept here for posterity (so future readers understand
why the code looks the way it does); unresolved gaps are flagged so
every tweet-writing context knows the ground truth.

**RESOLVED:**

1. ~~**Link in main tweet.**~~ **Fixed.** `social/src/compose.ts` now
   exports `composeMainTweet` (no URL) and `composeReplyBody` (bare
   URL). `social/src/post.ts` posts the main tweet then a self-reply
   carrying the URL. The OG card is auto-rendered on the reply.
2. ~~**12/day over-saturation.**~~ **Fixed.** `.github/workflows/x-post.yml`
   cut to 4 origin posts/day Mon–Fri at 9am, 10am, 1pm, 5pm ET (UTC
   13:00, 14:00, 17:00, 21:00). Total writes/month including self-reply:
   ~172 vs free-tier 1500 cap (~11% utilization).

**STILL OPEN:**

3. **No threads — single tweets only.** Threads get ~3x engagement and
   are SEO-indexable. The auto-poster currently has no thread mode. The
   right shape: 1 thread per accepted paper (4–8 tweets), then 5–8
   single pull-quote variants over the following 2 weeks.
4. **No reply-engagement loop.** When humans reply to @genyousha_lab,
   nothing currently responds. Forfeits the 75x reply-engaged-by-author
   weight on every reply received. Operator action.
5. **Account is not Premium.** Premium accounts get ~10x reach (Buffer
   n=18.8M); the algorithm code shows ~4x in-network and ~2x out-of-
   network multipliers for verified-author tweets. Cost ceiling
   ($0/mo paid infra) explicitly forbids this — accept the ceiling.
6. **No Bluesky cross-post.** Peer-reviewed studies (Deldjoo et al. 2025
   n=276,431 scholars; "Vibes Are Off" n=15,700+ academic accounts)
   document significant academic political-science migration to Bluesky.
   That audience is precisely our target. No infrastructure for this yet.

When writing a variant, **the URL is no longer in your tweet body** —
write the hook to be self-contained and compelling on its own; the link
appears one tap below in the self-reply.

### G. Niche-targeting (operator-driven, not auto-poster)

These are operator actions, not tweet-writing rules. Surfaced for
completeness:

- Build a list of ~30 anchor accounts in poli-sci methodology, AI-and-
  society, replication / meta-science. Notification on for the top 10.
- Seed substantive replies (cite a relevant @genyousha_lab paper when
  it actually applies — never just "we have a paper on this!") within
  the first 15 min of an anchor-account post.
- Maintain 1–2 public X lists ("Agentic political science", "AI for
  research"); surface them in the bio.
- Avoid follow/unfollow churn (>50/day = documented shadowban trigger).

---

## Current learnings (auto-updated)

> _No metrics collected yet. The first real entry will land here after
> `/restrategize-x` runs against actual performance data. See
> `social/metrics/README.md` for how to feed in analytics.x.com CSV
> exports — that's the primary data path on the free tier._

**Last refreshed:** never
**Window:** —
**Sample size:** 0 measured tweets

### What's working

_(empty)_

### What's not working

_(empty)_

### Suggested adjustments for the next tweet bank

_(empty)_
