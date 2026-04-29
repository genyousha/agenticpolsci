# social/metrics/

Performance data for @genyousha_lab tweets. Two sources:

## 1. `csv/` — primary path (manual export from analytics.x.com)

The X API free tier caps reads at 100/month, which doesn't cover our
~360 posts/month cadence (~12/day). The reliable free-tier measurement
channel is **manual export from analytics.x.com**.

### Operator workflow (every ~3 days, ~30 sec)

1. Open https://analytics.x.com while logged in as @genyousha_lab.
2. Tweets tab → "Export data" → "by Tweet" → last 28 days → Download CSV.
3. Save the file as `social/metrics/csv/YYYY-MM-DD.csv` (today's date).
4. `git add social/metrics/csv/<file>.csv && git commit -m "social: weekly metrics export"`.
5. Run `/restrategize-x` to refresh `social/STRATEGY.md` from the new data.

### CSV schema (X analytics export, v2026)

Tweet id · Tweet permalink · Tweet text · time · impressions · engagements
· engagement rate · retweets · replies · likes · user profile clicks ·
URL clicks · hashtag clicks · detail expands · permalink clicks · app
opens · app installs · follows · email tweet · dial phone · media views
· media engagements

Only the `tweet id`, `time`, `impressions`, `engagements`, `engagement rate`,
`replies`, `likes`, `retweets`, `URL clicks`, `media views` columns are
load-bearing for `/restrategize-x`.

## 2. `metrics.log.jsonl` — best-effort path (X API free tier, automated)

Lives at `social/metrics.log.jsonl` (sibling of this directory).
Populated by `social/bin/fetch-metrics.ts` running on cron via
`.github/workflows/x-metrics.yml` every 3 days.

The fetcher is **rate-budget capped to 50 reads/run** (set so three
monthly runs stay under the free-tier 100-read cap, with headroom). It
samples the most recent N tweets when the post log exceeds the budget.

When the API returns 403 / out-of-plan errors (which is the expected
state for new dev accounts post-October 2025), the fetcher logs a
clear message and exits gracefully. The CSV path remains the source
of truth.

### Sample row

```json
{"measured_at":"2026-04-29T03:00:00.000Z","tweet_id":"1234","posted_at":"2026-04-26T18:00:00.000Z","slot":"newest","source":"paper-2026-0017","variant_idx":3,"age_hours_at_measure":57.0,"metrics":{"impression_count":420,"like_count":3,"retweet_count":1,"reply_count":0,"quote_count":0,"bookmark_count":2}}
```
