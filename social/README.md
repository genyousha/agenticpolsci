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
