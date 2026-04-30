# Follow execution strategy — @genyousha_lab

Generated 2026-04-29. Companion to `social/anchors.yml` (18 anchors,
all verified) and `social/follow-candidates.md` (14 fresh candidates).
This file is the **operator's manual execution plan** — auto-follow is
infeasible (shadowban trigger + paid-tier API). Update this file when
the plan changes; the candidates file gets overwritten weekly by
`/find-follow-candidates`.

## TL;DR

Follow 32 accounts (18 anchors + 14 candidates) over 3 days at ≤12/day,
sequenced to front-load tier-1 fits. Then turn on bell notifications
for the top 10, build 2 public X lists, and reserve operator attention
for the actual growth lever: substantive replies on anchor posts within
15 minutes of them firing.

## Why this sequencing

Following someone is cheap. **Replying to them within 15 min, with
something they reply back to**, is the only growth lever that moves
the algorithm meaningfully (75× weight on reply-engaged-by-author per
the X 2023 open-source ranker).

So the follow order optimizes for **how often you'll see their posts
early enough to reply**, not for raw audience size:

1. Tier-1 candidates first — they're niche-dense and currently invisible
   to the algorithm as graph signal from us; adding them now diversifies
   our follow-graph fingerprint at the same moment we're posting daily.
2. Active polmeth anchors second — daily threads, replies in our niche.
3. AI-and-society + AI-infra anchors third — bigger audiences, lower
   density. Adding them only after day-1 follows have settled.
4. Tier-2 candidates + meta-science fourth — amplifier set.
5. Tier-3 + remaining anchors last — speculative or quiet.

## Cadence rules (don't violate)

- **Hard cap: 50 follows/day** is the documented X shadowban trigger.
  Plan stays at ≤12/day with wide margin.
- **No follow-then-unfollow.** Churn ≥50/day is also a shadowban
  trigger and the cleanup pattern is fingerprinted. If you accidentally
  follow someone you don't want, leave it for ≥2 weeks before
  unfollowing, then unfollow at most 5 in a day.
- **Don't follow back random new followers automatically** — vet for
  niche fit. Generic AI / poli-sci accounts dilute timeline density.
- **Spread follows across the day**, not in one click-burst.

## Day-by-day execution

### Day 1 — fresh tier-1 + most-active polmeth anchors (10 follows)

These are the highest-leverage names. Pin them in your head; you'll
reply to their posts often.

| # | Handle | Why this one first |
|---|---|---|
| 1 | [@b_m_stewart](https://x.com/b_m_stewart) | Brandon Stewart, Princeton — `stm` author. Direct text-as-data overlap with our papers. |
| 2 | [@chris_bail](https://x.com/chris_bail) | Duke — runs SICSS, the computational social-science talent pipeline = our exact ICP. |
| 3 | [@andyguess](https://x.com/andyguess) | Princeton CSMaP — pre-registered replication-style work, lots of method threads. |
| 4 | [@emollick](https://x.com/emollick) | Wharton — largest agent-curious academic audience (~1M+); replies aggressively. |
| 5 | [@dbroockman](https://x.com/dbroockman) | Berkeley — methods-critique threads; followers heavily polmeth-adjacent. |
| 6 | [@StatModeling](https://x.com/StatModeling) | Gelman — daily polmeth, our most-cited stats-methods anchor. |
| 7 | [@JustinGrimmer](https://x.com/JustinGrimmer) | Stanford — text-as-data, polmeth, replies frequently. |
| 8 | [@BrendanNyhan](https://x.com/BrendanNyhan) | Dartmouth — replication culture, misinformation methods. |
| 9 | [@random_walker](https://x.com/random_walker) | Narayanan — AI Snake Oil; replication-skeptical of AI claims, our exact frame. |
| 10 | [@sayashk](https://x.com/sayashk) | Kapoor — co-author with Narayanan; smaller audience, higher density. |

### Day 2 — tier-2 amplifiers + AI infra + meta-science (10 follows)

| # | Handle | Why now |
|---|---|---|
| 11 | [@JessicaHullman](https://x.com/JessicaHullman) | Northwestern — uncertainty viz, directly relevant to how our reports communicate. |
| 12 | [@swyx](https://x.com/swyx) | Latent Space — curates the AI engineer community; agent-as-reviewer is his beat. |
| 13 | [@HamelHusain](https://x.com/HamelHusain) | LLM-evals practitioner; peer-review-as-eval framing fits his audience. |
| 14 | [@ivanoransky](https://x.com/ivanoransky) | Retraction Watch personal account — more thread engagement than the org handle. |
| 15 | [@MicrobiomDigest](https://x.com/MicrobiomDigest) | Bik — research integrity sleuth; engaged audience around retraction stories. |
| 16 | [@karpathy](https://x.com/karpathy) | Largest agent/LLM educator on X. Audience overlap is real on agent-tooling demos. |
| 17 | [@simonw](https://x.com/simonw) | LLM CLI maintainer; prolific blogger, replies in our niche. |
| 18 | [@jeremyphoward](https://x.com/jeremyphoward) | fast.ai — agent-friendly Python ecosystem, friendly to academic posts. |
| 19 | [@BrianNosek](https://x.com/BrianNosek) | COS founder — meta-science figurehead, retweets replication wins. |
| 20 | [@OSFramework](https://x.com/OSFramework) | COS organizational account; paired with @BrianNosek. |

### Day 3 — remaining anchors + speculative tier-3 (≤12 follows)

| # | Handle | Why |
|---|---|---|
| 21 | [@maqartan](https://x.com/maqartan) | Humphreys — causal inference, comparative politics, WZB. |
| 22 | [@DrewLinzer](https://x.com/DrewLinzer) | Election modeling; surfaces during election cycles. |
| 23 | [@emilymbender](https://x.com/emilymbender) | Stochastic parrots; AI-and-society. |
| 24 | [@mmitchell_ai](https://x.com/mmitchell_ai) | Hugging Face; AI ethics. |
| 25 | [@RetractionWatch](https://x.com/RetractionWatch) | Org account — paired with @ivanoransky. |
| 26 | [@jburnmurdoch](https://x.com/jburnmurdoch) | FT — applied data viz; study how he grew a quantitative audience. |
| 27 | [@paulnovosad](https://x.com/paulnovosad) | Dartmouth — applied econ, thread-explainer style. Adjacent niche. |
| 28 | [@PolMethSociety](https://x.com/PolMethSociety) | Org account — list-inclusion candidate. |
| 29 | [@jamesheathers](https://x.com/jamesheathers) | Speculative — research-integrity ("data thug"); engagement bursty. |
| 30 | [@NateSilver538](https://x.com/NateSilver538) | Speculative — ~3M audience; topical fit narrow. Optional. |
| 31 | [@MonaChalabi](https://x.com/MonaChalabi) | Speculative — data journalism; broader audience. Optional. |
| 32 | [@flowingdata](https://x.com/flowingdata) | Speculative — data viz. Optional. |

If you skip the four "Optional" tier-3 entries, day 3 is 8 follows.

## Post-follow setup (do once, after day 3)

### Bell notifications — top 10 only

Per `STRATEGY.md` § G, the value of notifications is "be ready to reply
within 15 min." Notifications on too many accounts produces fatigue and
you stop reading them. Limit to 10:

1. @StatModeling — daily, our highest-overlap anchor
2. @JustinGrimmer — text-as-data
3. @BrendanNyhan — replication culture
4. @b_m_stewart — direct overlap
5. @chris_bail — SICSS / agent narratives
6. @andyguess — replication-style experiments
7. @emollick — agent posts where our angle plugs in
8. @dbroockman — methods-critique threads
9. @random_walker — AI-and-society replication framing
10. @RetractionWatch — retraction stories where our agent-replication papers fit

### Public X lists — surface in bio

Per `STRATEGY.md` § G, 1–2 public lists signal niche to both the
algorithm and visiting humans.

- **List 1: "Agentic political science"** — polmeth + replication.
  Members: all polmeth anchors (StatModeling, JustinGrimmer, maqartan,
  DrewLinzer, BrendanNyhan, paulnovosad, PolMethSociety) + tier-1
  poli-sci candidates (b_m_stewart, chris_bail, andyguess, dbroockman)
  + meta-science (BrianNosek, OSFramework, RetractionWatch, ivanoransky,
  MicrobiomDigest, jamesheathers).

- **List 2: "AI for research"** — agents + LLM tooling for academics.
  Members: AI-and-society + AI-infra anchors (random_walker, sayashk,
  emilymbender, mmitchell_ai, karpathy, simonw, jeremyphoward) +
  practitioner candidates (emollick, swyx, HamelHusain, JessicaHullman).

Add list URLs to the @genyousha_lab bio (or pinned post if bio is full).

## The actual growth lever — reply protocol

Following accounts is necessary but not sufficient. Replies are the
mechanism. Goal cadence:

- **1–3 substantive replies/day** on anchor / top-10 posts.
- **<30 min** to reply to humans who reply to @genyousha_lab posts
  (currently forfeit per `STRATEGY.md` § F.4).

Substantive = adds methodological insight, surfaces a specific finding,
or asks a real question they'd want to answer. **Never** "we have a
paper on this!" — that's the bot-pattern that triggers the −74 weight.

If a @genyousha_lab paper genuinely applies, link it; otherwise just
contribute. The follow is what gets you onto their timeline; the reply
is what gets your account onto *their followers'* timelines.

### When during the day

`STRATEGY.md` § C identifies the high-engagement windows: Tue 9 ET, Wed
9–10 ET. Anchor accounts post heavily in those windows. Operator
attention there pays the most.

## Anti-patterns to avoid

- **Mass-follow burst.** Spread day-1 follows across morning + afternoon,
  not 10 clicks in 90 seconds. Behavior fingerprint matters.
- **Follow → unfollow** even days later. Don't do it. If you mis-follow,
  leave it.
- **Following accounts not in this list because they "look interesting".**
  Most generic AI / poli-sci accounts are broadcast-only and dilute the
  density of useful posts in your timeline. Add new candidates by editing
  `anchors.yml` so they survive across runs.
- **Notifications on too many accounts.** 10 max. More = fatigue.
- **Replying with paper plugs that don't fit.** −74 weight per
  mute/block. The cost of looking spammy compounds across encounters.

## Self-evaluation checkpoints

After ~2 weeks (around 2026-05-13):

- Did follower count move? (Coarse signal — Premium-tier accounts get
  4–10× reach we don't have, so absolute numbers stay modest.)
- Did anchors / candidates engage with @genyousha_lab posts? Replies,
  retweets, profile clicks all matter; raw follow-back rate is the
  least informative.
- How many substantive replies did you actually post on anchor posts?
  If <5/week, the follow-graph wasn't the bottleneck — operator time
  was. Adjust.

If 2 weeks pass and the answer to "did you reply on any of these?" is
"no," the follow strategy isn't generating value yet — the bottleneck
is the reply-engagement loop, not the follow graph.
