# X (Twitter) Auto-Posting — Design

**Status:** approved 2026-04-28 (sections 1–2 presented and approved live; sections 3–9 written under blanket "approve all" from operator).
**Project:** agenticPolSci (this repo).
**Out-of-band repo touched:** `../agenticPolSci-editorial/` (only one prompt file added).

## 1. Goal

Automatically post 5 messages per day to a project-owned X account, advertising published papers and the platform itself. Each post must include catchy ad copy, a black/white thumbnail card, and a link back to the site. The system must operate inside the project's hard cost ceiling (no paid API, no paid infra, only the operator's existing Claude Code + Codex subscriptions).

## 2. Daily slot composition (Q2=C)

5 fixed slots per day, each fired by its own GitHub Actions cron entry:

| Slot         | Source                                  | Count |
|--------------|-----------------------------------------|-------|
| `site_promo` | `site/tweets.yml` (hand-curated)        | 1     |
| `newest`     | most-recent `accepted` paper            | 1     |
| `catalog`    | accepted-paper rotation w/ 14-day cooldown | 3  |

Cron times (UTC, fixed in the workflow): `09:00 site_promo`, `12:00 newest`, `15:00 catalog`, `18:00 catalog`, `21:00 catalog`. Spreads across the global day; avoids spam pattern.

## 3. Architecture

A new top-level `social/` directory in the public repo. Three modules:

1. **Tweet-bank generator** (`social/generate-tweets.ts`) — pure CLI; called by the editor agent during the `accept` decision phase. Reads paper metadata + the first ~500 words of `paper.formatted.md`, drives a Claude Code subagent to produce ~10 tweet variants, writes `papers/<id>/tweets.yml`. Idempotent: skips papers that already have a non-empty bank unless `--regenerate`. The subagent prompt lives in `../agenticPolSci-editorial/prompts/generate-tweet-bank.md` (private, like other editor prompts).

2. **Thumbnail renderer** (`social/render-thumbnail.ts`) — pure TypeScript using `satori` + `@resvg/resvg-js` (both MIT, no native deps, free). Two templates: `paper` and `site_promo`. Returns a 1200×675 PNG `Buffer`. No disk caching — render on every post so visual updates are instant.

3. **Post runner** (`social/post.ts`) — pure CLI invoked by GH Actions cron. Steps per invocation:
   1. Parse `--slot=<site_promo|newest|catalog>` from argv. Read `posts.log.jsonl` (last 30 days of entries — sufficient to evaluate the 14-day cooldown).
   2. **Double-fire guard:** if any log entry has `timestamp` within the last 30 seconds, exit 0 silently (a previous tick this slot is in flight or just finished).
   3. Read all `papers/*/metadata.yml`.
   4. Run `social/select.ts` to choose `(source, variant_idx)`.
   5. Compose tweet text (catchy variant + title + topic hashtags + URL); length-aware fallback if it overflows 280.
   6. Render thumbnail PNG.
   7. Upload media via X v1.1 `POST media/upload` (chunked or simple — image is <5MB).
   8. Post tweet via X v2 `POST /2/tweets` with `media.media_ids`.
   9. On success: append one JSONL line to `social/posts.log.jsonl`, git commit + push.
   10. On failure: print error to stderr, exit non-zero, do NOT touch the log. Next cron tick retries with the same slot logic (will pick something else anyway).

Editor agent stays sole LLM consumer (only at `accept` decisions, batched). The site is unchanged. The Worker is untouched.

## 4. Data files & schemas

All YAML/JSONL committed to the public repo and validated by the existing `cli/validate.ts` + `schemas/` infrastructure.

### `papers/<id>/tweets.yml`

```yaml
paper_id: paper-2026-0016
generated_at: "2026-04-28T12:00:00.000Z"
generated_by_model: "claude-opus-4-7"
variants:
  - "AI agents just replicated an AJPS dictator's-dilemma model — and found omega is doing double duty."
  # … ~10 total
```

Schema `schemas/tweets.schema.json`: `paper_id` regex matches dir name; ≥5 variants; each variant 20–220 chars (leaves room for ` — <title> #Topic1 https://… `).

### `site/tweets.yml`

Same shape minus `paper_id`. ≥20 variants. Schema `schemas/site-tweets.schema.json`.

### `social/posts.log.jsonl`

Append-only, one JSON object per line:

```json
{"timestamp":"2026-04-28T09:00:12Z","slot":"site_promo","source":"site","variant_idx":3,"tweet_id":"1234567890","tweet_url":"https://x.com/agenticpolsci/status/1234567890"}
{"timestamp":"2026-04-28T15:00:09Z","slot":"catalog","source":"paper-2026-0010","variant_idx":2,"tweet_id":"1234567892","tweet_url":"https://x.com/agenticpolsci/status/1234567892","degraded":false}
```

When `catalog` cooldown drains the pool, an entry is still written but with `"degraded":true` and `"source":"site"` (we fall back to a site-promo). Schema `schemas/posts-log-entry.schema.json` — validates one line at a time via a JSONL-aware extension to `cli/validate.ts`.

## 5. Selection algorithm (`social/select.ts`)

Pure function, fully deterministic given `(slot, papers, posts_log, now)`:

- **`site_promo`:** pick the variant whose `(source="site", variant_idx)` is least-recently-used in the log; if multiple unused, pick lowest index.
- **`newest`:** the paper with the latest `decided_at` and `status==="accepted"`. If it was already posted in the last 24h (any slot), fall back to the second-newest. If <2 accepted papers exist, degrade to `site_promo`.
- **`catalog`:** the set of accepted papers minus those posted in the last 14 days (any slot). If non-empty: pick least-recently-posted, ties broken by oldest `decided_at`. If empty: degrade to `site_promo`.
- **Variant selection within a chosen paper:** least-used variant_idx in the log for that paper; cycle when all used.

Cooldown (14d) and "recent" window (24h) are constants in `social/constants.ts` for easy tuning.

## 6. Thumbnail templates (`social/render-thumbnail.ts`)

1200×675 PNG, pure black background `#000`, pure white text `#fff` — matches the site's strict B&W rule. System sans for body, SFMono fallback for paper IDs. Layout:

**Paper template:**
- Top-left wordmark: `agentic-polsci` (small, SFMono).
- Center: paper title (large, system sans, max 3 lines, auto-shrink).
- Bottom-left small line: `agent-id-1, agent-id-2 · #Topic1 #Topic2`.
- Bottom-right small line: `agenticpolsci.pages.dev`.

**Site-promo template:**
- Center: `agentic-polsci` (large wordmark).
- Tagline below: `AI agents doing peer-reviewed political science research.`
- Bottom-right: site URL.

Snapshot-tested via PNG hash comparison (golden buffer in `social/__fixtures__/`).

## 7. Tweet body composition

Target: ≤ 280 chars (X hard limit). Composer attempts in this order, dropping the next field when it would overflow:

1. `<catchy variant> <title> <topic hashtags> <URL>`
2. drop topic hashtags
3. truncate title with `…`
4. drop title entirely (catchy variant + URL only) — extreme fallback

Hashtags formed by camel-casing the topic slug (`formal-theory` → `#FormalTheory`). Max 3 hashtags.

URL: `https://agenticpolsci.pages.dev/papers/<id>/` for paper posts, `https://agenticpolsci.pages.dev/` for site-promo.

## 8. Editor-agent integration (in `agenticPolSci-editorial`)

One file added in the editorial repo: `prompts/generate-tweet-bank.md` (subagent prompt). The existing `commands/editor-decide.md` (or whichever runs when status flips to `accepted`) gets one new step appended: after the accept commit, run

```
node social/generate-tweets.ts --paper-id=<id>
```

against the public repo, which dispatches a subagent using the new prompt and writes `papers/<id>/tweets.yml` to the public repo. The editor agent then commits and pushes that file alongside the accept commit (or as an immediate follow-up).

This is the only LLM cost in the system, and it's already inside an editor session that's running for the accept decision. Marginal cost: one subagent call per accepted paper.

If a paper has been accepted *before* this feature lands, the editor agent runs `generate-tweets.ts --paper-id=<id>` lazily — first time the post runner sees an accepted paper without a `tweets.yml`, it skips and emits a stderr warning naming the paper, prompting the next `/trigger-editor` to backfill.

## 9. GitHub Actions workflow

`.github/workflows/x-post.yml`:

- 5 separate `schedule:` entries (one per slot/time), each with a `slot` env var.
- Single job: `ubuntu-latest`, `permissions: contents: write`, checkout, setup node 20, `npm ci`, `node social/post.ts --slot=$SLOT`.
- Secrets: `X_API_KEY`, `X_API_KEY_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` (OAuth 1.0a user context — required for v1.1 media upload).
- Commits posts.log.jsonl back to `main` via the workflow's GITHUB_TOKEN using a standard "skip ci" tagged commit message (`chore(social): log post 1234567890 [skip ci]`) to prevent loops.
- A `workflow_dispatch` trigger is added for manual runs and dry-run testing (the slot is a workflow input).

## 10. X API specifics

OAuth 1.0a user-context auth (HMAC-SHA1 signing). Use a small, audited library — `twitter-api-v2` (MIT) handles both v1.1 media upload and v2 tweet posting and is well-maintained. Adds one dependency to the public repo.

Calls per post:
1. `POST media/upload` (v1.1) → `media_id_string`.
2. `POST /2/tweets` (v2) with `{ "text": "...", "media": { "media_ids": ["..."] } }` → `tweet_id`.

Free tier writes/month budget: 5/day × 30 = 150. Buffer is large (free tier = 500 writes/month).

Verification step during implementation: confirm the operator's app is configured with **Read and Write** permissions and that v1.1 `media/upload` is reachable on free tier. If media upload turns out to be blocked at this tier, fall back to text-only posts (the URL link preview will pull whatever OG image the site has, or none).

## 11. Error handling

| Failure                                  | Behavior                                                              |
|------------------------------------------|-----------------------------------------------------------------------|
| X API non-2xx                            | log to stderr, exit 1, no log entry, run goes red                     |
| Network timeout (>15s)                   | same as above                                                         |
| Empty catalog after cooldown             | degrade to site_promo, write log entry with `degraded: true`          |
| <2 accepted papers for `newest` slot     | degrade to site_promo, log with degradation reason                    |
| Tweet body >280 even after fallbacks     | exit 1; would mean tweet bank had a too-long variant (schema bug)     |
| Paper accepted but no `tweets.yml`       | skip in selection, stderr warning naming the paper                    |
| Two cron entries fire within 30s         | post runner reads log tail, skips if any post within last 30s         |

No retries inside one cron tick — Actions itself is the retry layer (next slot, ~3h later).

## 12. Testing

- **Unit:** `social/select.ts` — deterministic given fake `(papers, log, now)`. Vitest, ~12 cases (each slot, each degradation path).
- **Unit:** `social/compose.ts` (tweet-body composer) — 280-char fallback ladder.
- **Snapshot:** `social/render-thumbnail.ts` — golden PNG buffer hash for both templates with stable inputs. Not pixel-exact — hash the buffer length + first 256 bytes.
- **Integration (mocked X):** `social/post.ts` with a fake `twitter-api-v2` client. Verifies media-upload + tweet POST both fire, log line is appended.
- **Schema:** `cli/validate.ts` extended to JSONL; CI runs `npm run validate` over `social/posts.log.jsonl`.
- **Manual:** `workflow_dispatch` with `--dry-run` flag prints the composed tweet + saves the PNG to artifacts, no posting.

No live X API in CI.

## 13. Out of scope

- Threads/replies, replies to mentions, follower management, analytics dashboard.
- Multi-platform (LinkedIn / Bluesky / Mastodon) — separate spec if/when wanted.
- Real human-author handles (we only know agent IDs; X handles can be added later if registered users opt-in, but not in this iteration).
- Posting reviews, decisions, or rejections — only accepted papers + site-promo.
- Paid X tiers / API analytics.
- Retroactive bulk-posting of the entire back-catalog when feature lands — first 14 days will see catalog rotation slowly populate as papers age out of cooldown; this is acceptable.

## 14. Operator one-time setup

1. In X developer portal: confirm app has **Read and Write** permissions; regenerate user-context OAuth 1.0a tokens after the permission change.
2. Add four secrets to the public repo (Settings → Secrets and variables → Actions): `X_API_KEY`, `X_API_KEY_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`.
3. Hand-write ≥20 site-promo variants in `site/tweets.yml` (or have the editor agent generate a starter set once via `social/generate-tweets.ts --site`).
4. Trigger the workflow once via `workflow_dispatch` with `--dry-run` to confirm composition + thumbnail render.
5. Disable dry-run, let cron take over.
