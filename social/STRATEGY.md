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
   accounts (Buffer n=18.8M, 2024–2025). Put the link in the FIRST
   self-reply. The auto-poster currently puts the link inline — see
   "Pipeline gaps" below.
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

The auto-poster currently fires 12 times/day every 2h. **Research strongly
suggests this is over-saturation** for a niche academic account
(Sprout/Hootsuite/Buffer all converge on 3–5/day; 34% of users unfollow
brands that post too frequently). See "Pipeline gaps" — this is operator-
configurable in `.github/workflows/x-post.yml`.

**Time windows that matter (Buffer n=8.7M):** Tue 9am, Wed 9–10am ET (≈ 3pm
CET, covers US + EU academic audience). Skip 6–11pm and weekends for
primary promo. Saturday is the worst day.

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

### F. Pipeline gaps — known, surfaced, not yet fixed

These are deliberate trade-offs the operator hasn't acted on. Surfaced
here so every tweet-writing context knows the ground truth:

1. **Link is in the main tweet, not the first self-reply.**
   `social/src/compose.ts` → `composeTweetBody` appends the URL inline.
   Fix would require: post original (text + image), then post a self-
   reply with the URL via the X API `in_reply_to_tweet_id` field. Until
   that lands, expect free-tier link suppression on every post.
2. **Cadence is 12/day vs research-recommended 4–5 origin/day.**
   `.github/workflows/x-post.yml` cron set to every 2h. Reducing to 4
   origin posts (Tue/Wed/Thu high-engagement window + 1 evening) plus 4
   reply actions, 2 quote-posts, 2 thread continuations is the research-
   informed shape — but reply/quote/thread infrastructure doesn't exist
   yet. Operator awareness only.
3. **No threads — single tweets only.** Threads get ~3x engagement and
   are SEO-indexable. The auto-poster currently has no thread mode. The
   right shape: 1 thread per accepted paper (4–8 tweets), then 5–8
   single pull-quote variants over the following 2 weeks.
4. **No reply-engagement loop.** When humans reply to @genyousha_lab,
   nothing currently responds. Forfeits the 75x reply-engaged-by-author
   weight on every reply received.
5. **Account is not Premium.** Premium accounts get ~10x reach (Buffer
   n=18.8M); the algorithm code shows ~4x in-network and ~2x out-of-
   network multipliers for verified-author tweets. Cost ceiling
   ($0/mo paid infra) explicitly forbids this — accept the ceiling.
6. **No Bluesky cross-post.** Peer-reviewed studies (Deldjoo et al. 2025
   n=276,431 scholars; "Vibes Are Off" n=15,700+ academic accounts)
   document significant academic political-science migration to Bluesky.
   That audience is precisely our target. No infrastructure for this yet.

When writing a variant, **assume the link suppression and cadence
problems persist** — that's why the hook needs to be self-contained and
worth reading even if no one ever clicks the link.

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
