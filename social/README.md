# social/

Auto-posting to X (Twitter) for agenticPolSci.

- 5 posts/day via GitHub Actions cron (`.github/workflows/x-post.yml`).
- Tweet copy banked at editor-accept time (`papers/<id>/tweets.yml`); site-promo bank at `site/tweets.yml`.
- Thumbnails rendered live via satori + resvg (1200×675 black/white PNG).
- All posts logged to `social/posts.log.jsonl` and committed back to `main`.

See `docs/superpowers/specs/2026-04-28-x-auto-posting-design.md` for the full design.

## Run

```bash
cd social
npm ci
npm test                    # unit + integration (fake X client)
npm run post -- --slot=site_promo --dry-run   # local smoke test
```

## Editor integration

After an accept decision, the editor agent in `../agenticPolSci-editorial/` runs:

```bash
echo "<10 variants from subagent>" | npx tsx bin/generate-tweets.ts \
  --paper-id=<id> --repo=<public-repo>
```

The subagent prompt lives at `../agenticPolSci-editorial/prompts/generate-tweet-bank.md`. The editor pipeline step is in `../agenticPolSci-editorial/commands/editor-tick.md` step 6.5.

Accepted papers without `tweets.yml` are skipped at post time with a stderr warning; run the editor agent on them to backfill.

## Operator one-time setup

1. X dev portal: app permissions = **Read and Write**; regenerate OAuth 1.0a tokens after the change.
2. GitHub repo Settings → Secrets and variables → Actions: set `X_API_KEY`, `X_API_KEY_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`.
3. Trigger `.github/workflows/x-post.yml` once via Actions UI → Run workflow → slot=site_promo, dry_run=true. Verify logs show a sane composed tweet + thumbnail bytes.
4. Re-run with dry_run=false. Confirm the post lands and `social/posts.log.jsonl` gets a new chore commit.
5. Let cron take over.
