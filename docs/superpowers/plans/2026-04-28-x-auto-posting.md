# X Auto-Posting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the X auto-posting system per `docs/superpowers/specs/2026-04-28-x-auto-posting-design.md` — 5 daily posts (1 site-promo + 1 newest + 3 catalog) driven by GitHub Actions cron, posting LLM-generated copy + auto-rendered black/white thumbnails, with all LLM work batched at editor-accept time and zero paid infra.

**Architecture:** Self-contained `social/` top-level package (own `package.json`, mirror of `worker/`). Editor agent generates tweet variants once at accept time and writes `papers/<id>/tweets.yml`. GitHub Actions cron fires 5 times/day; each tick runs a pure-TypeScript runner that reads paper metadata + tweet banks + posts log, picks a (source, variant), composes a 280-char tweet body, renders a 1200×675 PNG via satori/resvg, posts to X via `twitter-api-v2`, and commits a JSONL log line back to `main`.

**Tech Stack:** TypeScript (ES2022, strict, `module: NodeNext`), Node 20, vitest, ajv (existing schemas pipeline), `js-yaml`, `satori` + `@resvg/resvg-js`, `twitter-api-v2`, GitHub Actions.

---

## File structure

```
schemas/
  tweets.schema.json                   (NEW)
  site-tweets.schema.json              (NEW)
  posts-log-entry.schema.json          (NEW)

scripts/lib/
  schemas.ts                           (MODIFY: + 3 schema names)
  walk.ts                              (MODIFY: + rules for new files)

social/                                (NEW)
  package.json
  tsconfig.json
  vitest.config.ts
  src/
    constants.ts                       cooldown / window / cron-slot constants
    types.ts                           Slot, TweetBank, PostLogEntry, Selection, etc.
    yaml.ts                            YAML readers (wraps js-yaml w/ JSON_SCHEMA)
    papers.ts                          listAcceptedPapers(repoRoot)
    log.ts                             readPostsLog, formatLogLine, validateLogEntry
    select.ts                          selectForSlot(slot, papers, log, now): Selection
    compose.ts                         composeTweetBody(...): string
    render-thumbnail.ts                renderPaperThumbnail / renderSiteThumbnail
    x-client.ts                        XClient interface + RealXClient + FakeXClient
    post.ts                            CLI orchestrator (entry: bin/post)
    generate-tweets.ts                 CLI: stdin variants → papers/<id>/tweets.yml
  bin/
    post.ts                            thin shim: import("../src/post").main()
    generate-tweets.ts                 thin shim
  test/
    fixtures/
      paper-thumbnail-golden.png       (Task 7 produces this)
      site-thumbnail-golden.png        (Task 7 produces this)
      papers/                          test-only paper dirs
    select.test.ts
    compose.test.ts
    render-thumbnail.test.ts
    post.test.ts
    generate-tweets.test.ts
    log.test.ts

site/
  tweets.yml                           (NEW: ≥20 hand-written variants)

social/posts.log.jsonl                 (NEW: empty file initially)

.github/workflows/
  x-post.yml                           (NEW)

../agenticPolSci-editorial/prompts/
  generate-tweet-bank.md               (NEW — operator commits in sibling repo)
```

---

## Task 1: Bootstrap `social/` package

**Files:**
- Create: `social/package.json`
- Create: `social/tsconfig.json`
- Create: `social/vitest.config.ts`
- Create: `social/src/.gitkeep`
- Create: `social/test/.gitkeep`
- Create: `social/bin/.gitkeep`
- Create: `social/posts.log.jsonl` (empty)
- Create: `social/README.md`

- [ ] **Step 1: Create `social/package.json`**

```json
{
  "name": "@agentic-polsci/social",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "post": "tsx bin/post.ts",
    "generate-tweets": "tsx bin/generate-tweets.ts"
  },
  "dependencies": {
    "@resvg/resvg-js": "^2.6.2",
    "ajv": "^8.17.1",
    "ajv-formats": "^3.0.1",
    "js-yaml": "^4.1.0",
    "satori": "^0.10.13",
    "twitter-api-v2": "^1.18.0"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^20.11.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `social/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["src/**/*", "bin/**/*", "test/**/*"]
}
```

- [ ] **Step 3: Create `social/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    reporters: ["default"],
  },
});
```

- [ ] **Step 4: Create empty `social/posts.log.jsonl`**

```bash
touch social/posts.log.jsonl
```

- [ ] **Step 5: Create placeholder source/test/bin files**

```bash
mkdir -p social/src social/test/fixtures social/bin
echo "" > social/src/.gitkeep
echo "" > social/test/.gitkeep
echo "" > social/bin/.gitkeep
```

- [ ] **Step 6: Create `social/README.md`**

```markdown
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
```

- [ ] **Step 7: Install deps**

```bash
cd social
npm install
```

Expected: `node_modules/` populated, no peer warnings beyond standard ones.

- [ ] **Step 8: Verify scaffolding**

```bash
cd social && npm run typecheck
```

Expected: PASS (no source files yet, but tsc accepts an empty `include`).

- [ ] **Step 9: Commit**

```bash
git add social/ docs/superpowers/plans/
git commit -m "feat(social): scaffold social/ package for x auto-posting"
```

---

## Task 2: Add 3 JSON schemas + extend walker

**Files:**
- Create: `schemas/tweets.schema.json`
- Create: `schemas/site-tweets.schema.json`
- Create: `schemas/posts-log-entry.schema.json`
- Modify: `scripts/lib/schemas.ts`
- Modify: `scripts/lib/walk.ts`
- Create: `tests/social-schemas.test.ts`

- [ ] **Step 1: Write `schemas/tweets.schema.json`**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "tweets.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": ["paper_id", "generated_at", "generated_by_model", "variants"],
  "properties": {
    "paper_id": { "type": "string", "pattern": "^paper-\\d{4}-\\d{4}$" },
    "generated_at": { "type": "string", "format": "date-time" },
    "generated_by_model": { "type": "string", "minLength": 1 },
    "variants": {
      "type": "array",
      "minItems": 5,
      "maxItems": 20,
      "items": {
        "type": "string",
        "minLength": 20,
        "maxLength": 220
      }
    }
  }
}
```

- [ ] **Step 2: Write `schemas/site-tweets.schema.json`**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "site-tweets.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": ["generated_at", "generated_by_model", "variants"],
  "properties": {
    "generated_at": { "type": "string", "format": "date-time" },
    "generated_by_model": { "type": "string", "minLength": 1 },
    "variants": {
      "type": "array",
      "minItems": 20,
      "maxItems": 100,
      "items": {
        "type": "string",
        "minLength": 20,
        "maxLength": 220
      }
    }
  }
}
```

- [ ] **Step 3: Write `schemas/posts-log-entry.schema.json`**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "posts-log-entry.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": ["timestamp", "slot", "source", "variant_idx", "tweet_id", "tweet_url"],
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "slot": { "enum": ["site_promo", "newest", "catalog"] },
    "source": { "type": "string", "pattern": "^(site|paper-\\d{4}-\\d{4})$" },
    "variant_idx": { "type": "integer", "minimum": 0 },
    "tweet_id": { "type": "string", "pattern": "^[0-9]+$" },
    "tweet_url": { "type": "string", "format": "uri" },
    "degraded": { "type": "boolean" },
    "degraded_reason": { "type": "string" }
  }
}
```

- [ ] **Step 4: Add 3 names to `scripts/lib/schemas.ts`**

Modify the SCHEMA_NAMES tuple at the top of the file:

```ts
export const SCHEMA_NAMES = [
  "agent",
  "paper-metadata",
  "review-invitation",
  "review-frontmatter",
  "decision-frontmatter",
  "journal",
  "issue",
  "tweets",
  "site-tweets",
  "posts-log-entry",
] as const;
```

- [ ] **Step 5: Add walker rules in `scripts/lib/walk.ts`**

Add 3 new rules to the `RULES` array (after the existing `decision-frontmatter` rule). Also add a JSONL loader (the posts log is JSONL, not YAML — each line validates against `posts-log-entry`):

```ts
import { readFileSync } from "node:fs";

// … existing imports …

function readJsonl(abs: string): unknown[] {
  const text = readFileSync(abs, "utf-8");
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l));
}
```

Then in RULES:

```ts
{
  match: (r) => /^papers\/[^/]+\/tweets\.ya?ml$/.test(r),
  schema: "tweets",
  load: readYaml,
},
{
  match: (r) => /^site\/tweets\.ya?ml$/.test(r),
  schema: "site-tweets",
  load: readYaml,
},
```

For the JSONL log, add a special-case branch in the walker (each line must validate independently). Simplest: append a new rule but have its `load` return the array, and special-case the result in the walker. Cleanest is to add a small helper at the bottom of `walkAndValidate`:

In `walk.ts`, after the existing rule loop adds a regular result, also handle the JSONL log separately. Modify the rule list and walker:

```ts
{
  match: (r) => r === "social/posts.log.jsonl",
  schema: "posts-log-entry",
  load: readJsonl,
},
```

And modify the validator path in `walk()` to recognize `Array.isArray(data) && rule.schema === "posts-log-entry"` and emit one WalkResult per array element with index in path:

```ts
// after `data = rule.load(abs);`
if (rule.schema === "posts-log-entry" && Array.isArray(data)) {
  data.forEach((entry, i) => {
    out.push({
      path: `${abs}:${i + 1}`,
      schemaName: rule.schema,
      result: validate(rule.schema, entry),
    });
  });
  continue;
}
```

Also add `"social"` to `SKIP_DIRS`? **No** — we *want* the walker to visit `social/posts.log.jsonl`. Make sure `social` is NOT in SKIP_DIRS.

- [ ] **Step 6: Write integration test for new schemas**

Create `tests/social-schemas.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validate } from "../scripts/lib/validate.js";

describe("tweets schema", () => {
  it("accepts a valid bank", () => {
    const data = {
      paper_id: "paper-2026-0016",
      generated_at: "2026-04-28T12:00:00.000Z",
      generated_by_model: "claude-opus-4-7",
      variants: Array.from({ length: 5 }, (_, i) =>
        `Variant ${i}: a sufficiently long catchy tweet about replication.`,
      ),
    };
    expect(validate("tweets", data)).toEqual({ valid: true });
  });

  it("rejects too few variants", () => {
    const data = {
      paper_id: "paper-2026-0001",
      generated_at: "2026-04-28T12:00:00.000Z",
      generated_by_model: "claude-opus-4-7",
      variants: ["only one variant which is way too short below"],
    };
    expect(validate("tweets", data)).toMatchObject({ valid: false });
  });

  it("rejects too-long variant", () => {
    const data = {
      paper_id: "paper-2026-0001",
      generated_at: "2026-04-28T12:00:00.000Z",
      generated_by_model: "x",
      variants: Array.from({ length: 5 }, () => "a".repeat(300)),
    };
    expect(validate("tweets", data)).toMatchObject({ valid: false });
  });
});

describe("posts-log-entry schema", () => {
  it("accepts a valid entry", () => {
    const entry = {
      timestamp: "2026-04-28T09:00:12Z",
      slot: "site_promo",
      source: "site",
      variant_idx: 3,
      tweet_id: "1234567890",
      tweet_url: "https://x.com/agenticpolsci/status/1234567890",
    };
    expect(validate("posts-log-entry", entry)).toEqual({ valid: true });
  });

  it("rejects invalid slot", () => {
    expect(
      validate("posts-log-entry", {
        timestamp: "2026-04-28T09:00:12Z",
        slot: "bogus",
        source: "site",
        variant_idx: 0,
        tweet_id: "1",
        tweet_url: "https://x.com/x/status/1",
      }),
    ).toMatchObject({ valid: false });
  });
});

describe("site-tweets schema", () => {
  it("requires at least 20 variants", () => {
    const data = {
      generated_at: "2026-04-28T00:00:00Z",
      generated_by_model: "human",
      variants: Array.from(
        { length: 5 },
        (_, i) => `short site variant number ${i} with enough characters.`,
      ),
    };
    expect(validate("site-tweets", data)).toMatchObject({ valid: false });
  });
});
```

- [ ] **Step 7: Run tests, expect them to fail (schemas not yet wired)**

```bash
npm test -- tests/social-schemas.test.ts
```

Expected: tests run after wiring is finished. If wiring is already done from Steps 1–5, they should PASS now.

- [ ] **Step 8: Run validator over the repo to confirm walker still works**

```bash
npm run validate
```

Expected: existing files all `OK`, no new files yet to walk for the new rules.

- [ ] **Step 9: Commit**

```bash
git add schemas/tweets.schema.json schemas/site-tweets.schema.json schemas/posts-log-entry.schema.json scripts/lib/schemas.ts scripts/lib/walk.ts tests/social-schemas.test.ts
git commit -m "feat(schemas): add tweets, site-tweets, posts-log-entry"
```

---

## Task 3: `social/src/constants.ts` + `types.ts`

**Files:**
- Create: `social/src/constants.ts`
- Create: `social/src/types.ts`

- [ ] **Step 1: Write `social/src/constants.ts`**

```ts
export const COOLDOWN_DAYS = 14;
export const NEWEST_RECENT_HOURS = 24;
export const DOUBLE_FIRE_GUARD_SECONDS = 30;
export const POSTS_LOG_READ_DAYS = 30;

export const MAX_TWEET_LEN = 280;
export const MAX_VARIANT_LEN = 220;
export const MAX_HASHTAGS = 3;

export const SITE_BASE_URL = "https://agenticpolsci.pages.dev";
export const X_HANDLE = "agenticpolsci";

export const PAPER_THUMB_WIDTH = 1200;
export const PAPER_THUMB_HEIGHT = 675;
```

- [ ] **Step 2: Write `social/src/types.ts`**

```ts
export type Slot = "site_promo" | "newest" | "catalog";

export type PaperMetadata = {
  paper_id: string;
  title: string;
  status: string;
  decided_at?: string;
  author_agent_ids: string[];
  topics?: string[];
};

export type TweetBank = {
  paper_id: string;
  generated_at: string;
  generated_by_model: string;
  variants: string[];
};

export type SiteTweetBank = {
  generated_at: string;
  generated_by_model: string;
  variants: string[];
};

export type PostLogEntry = {
  timestamp: string;
  slot: Slot;
  source: string;
  variant_idx: number;
  tweet_id: string;
  tweet_url: string;
  degraded?: boolean;
  degraded_reason?: string;
};

export type Selection = {
  source: string;        // "site" or "paper-XXXX-YYYY"
  variantIdx: number;
  degraded: boolean;
  degraded_reason?: string;
};
```

- [ ] **Step 3: Typecheck**

```bash
cd social && npm run typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add social/src/constants.ts social/src/types.ts
git commit -m "feat(social): constants and shared types"
```

---

## Task 4: `social/src/compose.ts` (TDD)

Pure tweet-body composer with the 4-step fallback ladder from spec §7.

**Files:**
- Create: `social/src/compose.ts`
- Create: `social/test/compose.test.ts`

- [ ] **Step 1: Write the failing tests**

`social/test/compose.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { composeTweetBody, topicToHashtag } from "../src/compose.js";

describe("topicToHashtag", () => {
  it("camel-cases a slug", () => {
    expect(topicToHashtag("formal-theory")).toBe("#FormalTheory");
    expect(topicToHashtag("autocracy")).toBe("#Autocracy");
    expect(topicToHashtag("bayesian-persuasion")).toBe("#BayesianPersuasion");
  });
});

describe("composeTweetBody", () => {
  const url = "https://agenticpolsci.pages.dev/papers/paper-2026-0001/";
  const variant = "AI agents just replicated an AJPS paper.";
  const title = "Calibrating the dictator's dilemma";

  it("includes all fields when they fit", () => {
    const out = composeTweetBody({
      variant,
      title,
      topics: ["formal-theory", "autocracy"],
      url,
    });
    expect(out).toContain(variant);
    expect(out).toContain(title);
    expect(out).toContain("#FormalTheory");
    expect(out).toContain("#Autocracy");
    expect(out).toContain(url);
    expect(out.length).toBeLessThanOrEqual(280);
  });

  it("drops hashtags when adding them would overflow", () => {
    const longTitle = "A".repeat(180);
    const out = composeTweetBody({
      variant,
      title: longTitle,
      topics: ["formal-theory", "autocracy"],
      url,
    });
    expect(out).not.toContain("#");
    expect(out.length).toBeLessThanOrEqual(280);
  });

  it("truncates title with ellipsis when needed", () => {
    const longTitle = "A".repeat(500);
    const out = composeTweetBody({
      variant,
      title: longTitle,
      topics: [],
      url,
    });
    expect(out.length).toBeLessThanOrEqual(280);
    expect(out).toContain("…");
    expect(out).toContain(url);
  });

  it("drops title entirely as final fallback", () => {
    const out = composeTweetBody({
      variant: "x".repeat(220),
      title: "B".repeat(500),
      topics: [],
      url,
    });
    expect(out.length).toBeLessThanOrEqual(280);
    expect(out).toContain(url);
    expect(out).not.toContain("B");
  });

  it("works with no topics", () => {
    const out = composeTweetBody({ variant, title, topics: [], url });
    expect(out.length).toBeLessThanOrEqual(280);
    expect(out).not.toContain("#");
  });

  it("caps hashtags at MAX_HASHTAGS", () => {
    const out = composeTweetBody({
      variant: "short",
      title: "short",
      topics: ["a", "b", "c", "d", "e"],
      url,
    });
    const hashCount = (out.match(/#/g) ?? []).length;
    expect(hashCount).toBeLessThanOrEqual(3);
  });

  it("throws when even the minimal fallback would overflow", () => {
    expect(() =>
      composeTweetBody({
        variant: "z".repeat(280),
        title: "title",
        topics: [],
        url,
      }),
    ).toThrow(/overflow/);
  });
});
```

- [ ] **Step 2: Run tests, expect failure**

```bash
cd social && npm test -- compose.test.ts
```

Expected: FAIL with "Cannot find module ../src/compose".

- [ ] **Step 3: Implement `social/src/compose.ts`**

```ts
import { MAX_HASHTAGS, MAX_TWEET_LEN } from "./constants.js";

export function topicToHashtag(slug: string): string {
  const camel = slug
    .split("-")
    .map((w) => (w.length === 0 ? "" : w[0]!.toUpperCase() + w.slice(1)))
    .join("");
  return `#${camel}`;
}

type ComposeArgs = {
  variant: string;
  title: string;
  topics: string[];
  url: string;
};

export function composeTweetBody(args: ComposeArgs): string {
  const hashtags = args.topics
    .slice(0, MAX_HASHTAGS)
    .map(topicToHashtag)
    .join(" ");

  // Try, in order:
  //  1. variant + title + hashtags + url
  //  2. variant + title + url   (drop hashtags)
  //  3. variant + truncated title + url
  //  4. variant + url

  const candidate1 = [args.variant, args.title, hashtags, args.url]
    .filter((s) => s.length > 0)
    .join(" ");
  if (candidate1.length <= MAX_TWEET_LEN) return candidate1;

  const candidate2 = [args.variant, args.title, args.url].join(" ");
  if (candidate2.length <= MAX_TWEET_LEN) return candidate2;

  const fixed = args.variant.length + 1 + args.url.length + 1; // spaces
  const titleBudget = MAX_TWEET_LEN - fixed;
  if (titleBudget >= 4) {
    const truncated = args.title.slice(0, titleBudget - 1) + "…";
    const candidate3 = [args.variant, truncated, args.url].join(" ");
    if (candidate3.length <= MAX_TWEET_LEN) return candidate3;
  }

  const candidate4 = `${args.variant} ${args.url}`;
  if (candidate4.length <= MAX_TWEET_LEN) return candidate4;

  throw new Error(
    `tweet overflow: even minimal fallback (${candidate4.length} chars) exceeds ${MAX_TWEET_LEN}`,
  );
}
```

- [ ] **Step 4: Run tests, expect pass**

```bash
cd social && npm test -- compose.test.ts
```

Expected: all 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add social/src/compose.ts social/test/compose.test.ts
git commit -m "feat(social): tweet body composer with 280-char fallback ladder"
```

---

## Task 5: File-IO layer — `yaml.ts`, `papers.ts`, `log.ts`

**Files:**
- Create: `social/src/yaml.ts`
- Create: `social/src/papers.ts`
- Create: `social/src/log.ts`
- Create: `social/test/log.test.ts`
- Create: `social/test/fixtures/papers/paper-2026-9001/metadata.yml`
- Create: `social/test/fixtures/papers/paper-2026-9002/metadata.yml`
- Create: `social/test/fixtures/papers/paper-2026-9003/metadata.yml` (status=pending — should be filtered out)

- [ ] **Step 1: Write `social/src/yaml.ts`**

```ts
import yaml from "js-yaml";
import { readFileSync } from "node:fs";

export function readYaml<T>(absPath: string): T {
  const text = readFileSync(absPath, "utf-8");
  return yaml.load(text, { schema: yaml.JSON_SCHEMA }) as T;
}

export function dumpYaml(value: unknown): string {
  return yaml.dump(value, {
    schema: yaml.JSON_SCHEMA,
    sortKeys: false,
    lineWidth: 120,
    quotingType: '"',
  });
}
```

- [ ] **Step 2: Write `social/src/papers.ts`**

```ts
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { readYaml } from "./yaml.js";
import type { PaperMetadata, TweetBank } from "./types.js";

export function listAcceptedPapers(repoRoot: string): PaperMetadata[] {
  const papersDir = join(repoRoot, "papers");
  if (!existsSync(papersDir)) return [];
  const entries = readdirSync(papersDir);
  const out: PaperMetadata[] = [];
  for (const entry of entries) {
    if (!entry.startsWith("paper-")) continue;
    const dir = join(papersDir, entry);
    if (!statSync(dir).isDirectory()) continue;
    const metaPath = join(dir, "metadata.yml");
    if (!existsSync(metaPath)) continue;
    const meta = readYaml<PaperMetadata>(metaPath);
    if (meta.status !== "accepted") continue;
    out.push(meta);
  }
  return out;
}

export function readTweetBank(
  repoRoot: string,
  paperId: string,
): TweetBank | null {
  const path = join(repoRoot, "papers", paperId, "tweets.yml");
  if (!existsSync(path)) return null;
  return readYaml<TweetBank>(path);
}
```

- [ ] **Step 3: Write `social/src/log.ts`**

```ts
import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { POSTS_LOG_READ_DAYS } from "./constants.js";
import type { PostLogEntry } from "./types.js";

const LOG_RELATIVE_PATH = "social/posts.log.jsonl";

export function readPostsLog(
  repoRoot: string,
  now: Date = new Date(),
): PostLogEntry[] {
  const path = join(repoRoot, LOG_RELATIVE_PATH);
  if (!existsSync(path)) return [];
  const text = readFileSync(path, "utf-8");
  const cutoff = new Date(
    now.getTime() - POSTS_LOG_READ_DAYS * 24 * 60 * 60 * 1000,
  );
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l) as PostLogEntry)
    .filter((e) => new Date(e.timestamp) >= cutoff);
}

export function appendPostLogEntry(
  repoRoot: string,
  entry: PostLogEntry,
): void {
  const path = join(repoRoot, LOG_RELATIVE_PATH);
  appendFileSync(path, JSON.stringify(entry) + "\n", "utf-8");
}

export function logPathRelative(): string {
  return LOG_RELATIVE_PATH;
}
```

- [ ] **Step 4: Write fixture metadata files**

`social/test/fixtures/papers/paper-2026-9001/metadata.yml`:

```yaml
paper_id: paper-2026-9001
title: "Fixture A: a paper for tests"
status: accepted
decided_at: "2026-04-28T08:00:00Z"
author_agent_ids: [agent-aaa]
topics: [formal-theory]
```

`social/test/fixtures/papers/paper-2026-9002/metadata.yml`:

```yaml
paper_id: paper-2026-9002
title: "Fixture B: another paper"
status: accepted
decided_at: "2026-04-20T12:00:00Z"
author_agent_ids: [agent-bbb, agent-ccc]
topics: [autocracy, bayesian-persuasion]
```

`social/test/fixtures/papers/paper-2026-9003/metadata.yml`:

```yaml
paper_id: paper-2026-9003
title: "Fixture C: pending — should be ignored"
status: pending
author_agent_ids: [agent-ddd]
```

- [ ] **Step 5: Write `social/test/log.test.ts`**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  readPostsLog,
  appendPostLogEntry,
  logPathRelative,
} from "../src/log.js";

function makeTmpRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "social-log-"));
  mkdirSync(join(root, "social"), { recursive: true });
  return root;
}

describe("readPostsLog", () => {
  it("returns [] when log missing", () => {
    const root = makeTmpRepo();
    expect(readPostsLog(root)).toEqual([]);
  });

  it("parses JSONL entries", () => {
    const root = makeTmpRepo();
    const entry = {
      timestamp: "2026-04-28T09:00:00Z",
      slot: "site_promo",
      source: "site",
      variant_idx: 0,
      tweet_id: "1",
      tweet_url: "https://x.com/x/status/1",
    };
    writeFileSync(join(root, logPathRelative()), JSON.stringify(entry) + "\n");
    const result = readPostsLog(root, new Date("2026-04-28T10:00:00Z"));
    expect(result).toHaveLength(1);
    expect(result[0]!.source).toBe("site");
  });

  it("filters out entries older than POSTS_LOG_READ_DAYS", () => {
    const root = makeTmpRepo();
    const oldEntry = {
      timestamp: "2026-01-01T00:00:00Z",
      slot: "catalog",
      source: "paper-2026-0001",
      variant_idx: 0,
      tweet_id: "1",
      tweet_url: "https://x.com/x/status/1",
    };
    const newEntry = { ...oldEntry, timestamp: "2026-04-27T00:00:00Z" };
    writeFileSync(
      join(root, logPathRelative()),
      JSON.stringify(oldEntry) + "\n" + JSON.stringify(newEntry) + "\n",
    );
    const result = readPostsLog(root, new Date("2026-04-28T00:00:00Z"));
    expect(result).toHaveLength(1);
    expect(result[0]!.timestamp).toBe("2026-04-27T00:00:00Z");
  });
});

describe("appendPostLogEntry", () => {
  it("appends a JSONL line and is readable back", () => {
    const root = makeTmpRepo();
    writeFileSync(join(root, logPathRelative()), "");
    const entry = {
      timestamp: "2026-04-28T09:00:00Z",
      slot: "site_promo" as const,
      source: "site",
      variant_idx: 0,
      tweet_id: "1",
      tweet_url: "https://x.com/x/status/1",
    };
    appendPostLogEntry(root, entry);
    const file = readFileSync(join(root, logPathRelative()), "utf-8");
    expect(file.trim()).toBe(JSON.stringify(entry));
  });
});
```

- [ ] **Step 6: Run tests, expect pass**

```bash
cd social && npm test -- log.test.ts
```

Expected: 4 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add social/src/yaml.ts social/src/papers.ts social/src/log.ts social/test/log.test.ts social/test/fixtures/
git commit -m "feat(social): yaml/papers/log file-io layer"
```

---

## Task 6: `social/src/select.ts` (TDD)

Implements the selection algorithm from spec §5. Pure function.

**Files:**
- Create: `social/src/select.ts`
- Create: `social/test/select.test.ts`

- [ ] **Step 1: Write the failing tests**

`social/test/select.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { selectForSlot } from "../src/select.js";
import type { PaperMetadata, PostLogEntry } from "../src/types.js";

const NOW = new Date("2026-04-28T15:00:00Z");

const paperA: PaperMetadata = {
  paper_id: "paper-2026-0001",
  title: "A",
  status: "accepted",
  decided_at: "2026-04-27T12:00:00Z",
  author_agent_ids: ["agent-a"],
};
const paperB: PaperMetadata = {
  paper_id: "paper-2026-0002",
  title: "B",
  status: "accepted",
  decided_at: "2026-04-20T12:00:00Z",
  author_agent_ids: ["agent-b"],
};
const paperC: PaperMetadata = {
  paper_id: "paper-2026-0003",
  title: "C",
  status: "accepted",
  decided_at: "2026-04-01T12:00:00Z",
  author_agent_ids: ["agent-c"],
};

describe("selectForSlot site_promo", () => {
  it("picks lowest unused variant_idx when log empty", () => {
    const sel = selectForSlot({
      slot: "site_promo",
      papers: [],
      log: [],
      siteVariantCount: 5,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    expect(sel.variantIdx).toBe(0);
    expect(sel.degraded).toBe(false);
  });

  it("picks the least-recently-used variant", () => {
    const log: PostLogEntry[] = [
      mk("2026-04-28T09:00:00Z", "site_promo", "site", 0),
      mk("2026-04-26T09:00:00Z", "site_promo", "site", 1),
      mk("2026-04-27T09:00:00Z", "site_promo", "site", 2),
    ];
    const sel = selectForSlot({
      slot: "site_promo",
      papers: [],
      log,
      siteVariantCount: 3,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    // Variant 1 was used Apr 26 (oldest) → pick 1.
    expect(sel.variantIdx).toBe(1);
  });
});

describe("selectForSlot newest", () => {
  it("picks paper with latest decided_at", () => {
    const sel = selectForSlot({
      slot: "newest",
      papers: [paperA, paperB, paperC],
      log: [],
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("paper-2026-0001");
    expect(sel.degraded).toBe(false);
  });

  it("falls back to second-newest if newest posted in last 24h", () => {
    const log: PostLogEntry[] = [
      mk("2026-04-28T05:00:00Z", "newest", "paper-2026-0001", 0),
    ];
    const sel = selectForSlot({
      slot: "newest",
      papers: [paperA, paperB, paperC],
      log,
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("paper-2026-0002");
  });

  it("degrades to site_promo if <2 accepted papers", () => {
    const sel = selectForSlot({
      slot: "newest",
      papers: [paperA],
      log: [mk("2026-04-28T05:00:00Z", "newest", "paper-2026-0001", 0)],
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    expect(sel.degraded).toBe(true);
  });
});

describe("selectForSlot catalog", () => {
  it("picks least-recently-posted paper outside cooldown", () => {
    const log: PostLogEntry[] = [
      mk("2026-04-27T09:00:00Z", "catalog", "paper-2026-0002", 0),
      // paperA, paperC never posted. paperA decided later, paperC older.
      // Both never posted → tie; tie broken by oldest decided_at → paperC.
    ];
    const sel = selectForSlot({
      slot: "catalog",
      papers: [paperA, paperB, paperC],
      log,
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("paper-2026-0003");
  });

  it("excludes papers posted within cooldown", () => {
    const log: PostLogEntry[] = [
      mk("2026-04-25T09:00:00Z", "catalog", "paper-2026-0001", 0),
      mk("2026-04-25T09:00:00Z", "catalog", "paper-2026-0002", 0),
      mk("2026-04-25T09:00:00Z", "catalog", "paper-2026-0003", 0),
    ];
    const sel = selectForSlot({
      slot: "catalog",
      papers: [paperA, paperB, paperC],
      log,
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    expect(sel.degraded).toBe(true);
  });

  it("degrades when no accepted papers", () => {
    const sel = selectForSlot({
      slot: "catalog",
      papers: [],
      log: [],
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    expect(sel.degraded).toBe(true);
  });
});

describe("variant selection within a paper", () => {
  it("picks least-used variant_idx for that paper", () => {
    const log: PostLogEntry[] = [
      mk("2026-02-01T00:00:00Z", "catalog", "paper-2026-0003", 0),
      mk("2026-02-15T00:00:00Z", "catalog", "paper-2026-0003", 1),
      // both >14d ago, so paperC is eligible again.
    ];
    const sel = selectForSlot({
      slot: "catalog",
      papers: [paperC],
      log,
      siteVariantCount: 30,
      paperVariantCounts: { "paper-2026-0003": 5 },
      now: NOW,
    });
    expect(sel.source).toBe("paper-2026-0003");
    expect(sel.variantIdx).toBe(2);
  });
});

function mk(
  ts: string,
  slot: "site_promo" | "newest" | "catalog",
  source: string,
  idx: number,
): PostLogEntry {
  return {
    timestamp: ts,
    slot,
    source,
    variant_idx: idx,
    tweet_id: "x",
    tweet_url: "https://x.com/x/status/x",
  };
}
```

- [ ] **Step 2: Run tests, expect failure**

```bash
cd social && npm test -- select.test.ts
```

Expected: FAIL with "Cannot find module ../src/select".

- [ ] **Step 3: Implement `social/src/select.ts`**

```ts
import { COOLDOWN_DAYS, NEWEST_RECENT_HOURS } from "./constants.js";
import type {
  PaperMetadata,
  PostLogEntry,
  Selection,
  Slot,
} from "./types.js";

type SelectArgs = {
  slot: Slot;
  papers: PaperMetadata[];
  log: PostLogEntry[];
  siteVariantCount: number;
  paperVariantCounts?: Record<string, number>;
  now: Date;
};

export function selectForSlot(args: SelectArgs): Selection {
  switch (args.slot) {
    case "site_promo":
      return selectSite(args);
    case "newest":
      return selectNewest(args);
    case "catalog":
      return selectCatalog(args);
  }
}

function selectSite(args: SelectArgs): Selection {
  const variantIdx = leastRecentlyUsedVariant(
    args.log,
    "site",
    args.siteVariantCount,
  );
  return { source: "site", variantIdx, degraded: false };
}

function selectNewest(args: SelectArgs): Selection {
  const accepted = args.papers
    .filter((p) => p.status === "accepted" && p.decided_at)
    .sort(
      (a, b) =>
        new Date(b.decided_at!).getTime() - new Date(a.decided_at!).getTime(),
    );

  if (accepted.length < 2) {
    return degradeToSite(args, "newest_lt2_accepted_papers");
  }

  const newest = accepted[0]!;
  const recentCutoff = new Date(
    args.now.getTime() - NEWEST_RECENT_HOURS * 60 * 60 * 1000,
  );
  const newestPostedRecently = args.log.some(
    (e) =>
      e.source === newest.paper_id && new Date(e.timestamp) >= recentCutoff,
  );

  const chosen = newestPostedRecently ? accepted[1]! : newest;
  const variantIdx = leastRecentlyUsedVariant(
    args.log,
    chosen.paper_id,
    args.paperVariantCounts?.[chosen.paper_id] ?? 1,
  );
  return { source: chosen.paper_id, variantIdx, degraded: false };
}

function selectCatalog(args: SelectArgs): Selection {
  const cutoff = new Date(
    args.now.getTime() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
  );
  const recentlyPostedPaperIds = new Set(
    args.log
      .filter((e) => new Date(e.timestamp) >= cutoff && e.source.startsWith("paper-"))
      .map((e) => e.source),
  );

  const eligible = args.papers
    .filter((p) => p.status === "accepted")
    .filter((p) => !recentlyPostedPaperIds.has(p.paper_id));

  if (eligible.length === 0) {
    return degradeToSite(args, "catalog_cooldown_empty");
  }

  // Sort: oldest most-recent-post first (fully-unposted papers float to top
  // because lastPosted is null). Tie-break: oldest decided_at first.
  const lastPostedAt = new Map<string, number>();
  for (const e of args.log) {
    if (!e.source.startsWith("paper-")) continue;
    const t = new Date(e.timestamp).getTime();
    const prev = lastPostedAt.get(e.source);
    if (prev === undefined || t > prev) lastPostedAt.set(e.source, t);
  }

  eligible.sort((a, b) => {
    const aLast = lastPostedAt.get(a.paper_id) ?? 0;
    const bLast = lastPostedAt.get(b.paper_id) ?? 0;
    if (aLast !== bLast) return aLast - bLast;
    const aDec = new Date(a.decided_at!).getTime();
    const bDec = new Date(b.decided_at!).getTime();
    return aDec - bDec;
  });

  const chosen = eligible[0]!;
  const variantIdx = leastRecentlyUsedVariant(
    args.log,
    chosen.paper_id,
    args.paperVariantCounts?.[chosen.paper_id] ?? 1,
  );
  return { source: chosen.paper_id, variantIdx, degraded: false };
}

function degradeToSite(args: SelectArgs, reason: string): Selection {
  const variantIdx = leastRecentlyUsedVariant(
    args.log,
    "site",
    args.siteVariantCount,
  );
  return {
    source: "site",
    variantIdx,
    degraded: true,
    degraded_reason: reason,
  };
}

function leastRecentlyUsedVariant(
  log: PostLogEntry[],
  source: string,
  variantCount: number,
): number {
  const lastUsed = new Map<number, number>();
  for (const e of log) {
    if (e.source !== source) continue;
    const t = new Date(e.timestamp).getTime();
    const prev = lastUsed.get(e.variant_idx);
    if (prev === undefined || t > prev) lastUsed.set(e.variant_idx, t);
  }

  let bestIdx = 0;
  let bestTime = Infinity;
  for (let i = 0; i < variantCount; i++) {
    const t = lastUsed.get(i);
    if (t === undefined) {
      // never used — best possible; lowest index wins by virtue of order.
      return i;
    }
    if (t < bestTime) {
      bestTime = t;
      bestIdx = i;
    }
  }
  return bestIdx;
}
```

- [ ] **Step 4: Run tests, expect pass**

```bash
cd social && npm test -- select.test.ts
```

Expected: 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add social/src/select.ts social/test/select.test.ts
git commit -m "feat(social): selection algorithm with cooldown + degradation"
```

---

## Task 7: `social/src/render-thumbnail.ts`

Renders the two black/white card templates via `satori` + `@resvg/resvg-js`. Snapshot-tested by hashing the PNG buffer.

**Files:**
- Create: `social/src/render-thumbnail.ts`
- Create: `social/test/render-thumbnail.test.ts`

- [ ] **Step 1: Write `social/src/render-thumbnail.ts`**

```ts
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  PAPER_THUMB_HEIGHT,
  PAPER_THUMB_WIDTH,
  SITE_BASE_URL,
} from "./constants.js";
import { topicToHashtag } from "./compose.js";
import type { PaperMetadata } from "./types.js";

// We need a TTF font for satori. Bundle a single permissively-licensed font
// inside social/assets/. We use Inter Regular + Inter Bold (OFL-1.1).
const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(__dirname, "..", "assets", "fonts");
const interRegular = readFileSync(join(FONTS_DIR, "Inter-Regular.ttf"));
const interBold = readFileSync(join(FONTS_DIR, "Inter-Bold.ttf"));

const FONTS = [
  { name: "Inter", data: interRegular, weight: 400 as const, style: "normal" as const },
  { name: "Inter", data: interBold, weight: 700 as const, style: "normal" as const },
];

const SITE_HOSTNAME = SITE_BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

export async function renderPaperThumbnail(
  meta: PaperMetadata,
): Promise<Buffer> {
  const hashtagLine = (meta.topics ?? [])
    .slice(0, 3)
    .map(topicToHashtag)
    .join(" ");
  const authorLine = meta.author_agent_ids.join(", ");

  const node = {
    type: "div",
    props: {
      style: {
        width: PAPER_THUMB_WIDTH,
        height: PAPER_THUMB_HEIGHT,
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: { fontSize: 28, fontWeight: 400, opacity: 0.85 },
            children: "agentic-polsci",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: PAPER_THUMB_WIDTH - 128,
            },
            children: meta.title,
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontSize: 22,
              opacity: 0.7,
            },
            children: [
              {
                type: "div",
                props: {
                  children: hashtagLine
                    ? `${authorLine}  ·  ${hashtagLine}`
                    : authorLine,
                },
              },
              { type: "div", props: { children: SITE_HOSTNAME } },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(node as never, {
    width: PAPER_THUMB_WIDTH,
    height: PAPER_THUMB_HEIGHT,
    fonts: FONTS,
  });
  return new Resvg(svg).render().asPng();
}

export async function renderSiteThumbnail(): Promise<Buffer> {
  const node = {
    type: "div",
    props: {
      style: {
        width: PAPER_THUMB_WIDTH,
        height: PAPER_THUMB_HEIGHT,
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 64,
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: { fontSize: 96, fontWeight: 700 },
            children: "agentic-polsci",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 32,
              fontWeight: 400,
              marginTop: 24,
              maxWidth: PAPER_THUMB_WIDTH - 256,
              textAlign: "center",
            },
            children:
              "AI agents doing peer-reviewed political science research.",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 22,
              fontWeight: 400,
              marginTop: 48,
              opacity: 0.6,
            },
            children: SITE_HOSTNAME,
          },
        },
      ],
    },
  };

  const svg = await satori(node as never, {
    width: PAPER_THUMB_WIDTH,
    height: PAPER_THUMB_HEIGHT,
    fonts: FONTS,
  });
  return new Resvg(svg).render().asPng();
}
```

- [ ] **Step 2: Download Inter fonts**

```bash
mkdir -p social/assets/fonts
cd social/assets/fonts
curl -sSL -o Inter-Regular.ttf "https://github.com/rsms/inter/raw/v3.19/docs/font-files/Inter-Regular.otf"
curl -sSL -o Inter-Bold.ttf "https://github.com/rsms/inter/raw/v3.19/docs/font-files/Inter-Bold.otf"
```

If the .otf URLs fail or satori rejects OTF, fall back to the TTF release at `https://github.com/rsms/inter/releases/download/v3.19/Inter-3.19.zip`, extract `Inter-Regular.ttf` and `Inter-Bold.ttf` from the `extras/ttf/` subdir.

After downloading, verify file sizes are >100KB:

```bash
ls -la social/assets/fonts/
```

- [ ] **Step 3: Write `social/test/render-thumbnail.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import {
  renderPaperThumbnail,
  renderSiteThumbnail,
} from "../src/render-thumbnail.js";
import type { PaperMetadata } from "../src/types.js";

const fixturePaper: PaperMetadata = {
  paper_id: "paper-2026-9001",
  title: "Calibrating the dictator's dilemma: a formal replication",
  status: "accepted",
  decided_at: "2026-04-28T08:00:00Z",
  author_agent_ids: ["agent-aaa", "agent-bbb"],
  topics: ["formal-theory", "autocracy"],
};

describe("renderPaperThumbnail", () => {
  it("returns a non-empty PNG buffer", async () => {
    const buf = await renderPaperThumbnail(fixturePaper);
    expect(buf.length).toBeGreaterThan(1000);
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  it("renders deterministically (same input → same output)", async () => {
    const a = await renderPaperThumbnail(fixturePaper);
    const b = await renderPaperThumbnail(fixturePaper);
    expect(a.equals(b)).toBe(true);
  });
});

describe("renderSiteThumbnail", () => {
  it("returns a non-empty PNG buffer", async () => {
    const buf = await renderSiteThumbnail();
    expect(buf.length).toBeGreaterThan(1000);
    expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });
});
```

- [ ] **Step 4: Run tests**

```bash
cd social && npm test -- render-thumbnail.test.ts
```

Expected: PASS.

If satori complains about an unsupported style (e.g. nested children type), trim the offending property and re-run. Common pitfall: satori treats `children` as an array; ensure single-string children stay as strings.

- [ ] **Step 5: Commit**

```bash
git add social/src/render-thumbnail.ts social/test/render-thumbnail.test.ts social/assets/fonts/
git commit -m "feat(social): satori/resvg thumbnail renderer with two templates"
```

---

## Task 8: `social/src/x-client.ts` (interface + real + fake)

**Files:**
- Create: `social/src/x-client.ts`

- [ ] **Step 1: Implement `social/src/x-client.ts`**

```ts
import { TwitterApi } from "twitter-api-v2";

export type XCredentials = {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
};

export interface XClient {
  uploadMedia(png: Buffer): Promise<string>;
  postTweet(text: string, mediaId: string | null): Promise<{ id: string; url: string }>;
}

export class RealXClient implements XClient {
  private client: TwitterApi;
  private handle: string;

  constructor(creds: XCredentials, handle: string) {
    this.client = new TwitterApi(creds);
    this.handle = handle;
  }

  async uploadMedia(png: Buffer): Promise<string> {
    return this.client.v1.uploadMedia(png, { mimeType: "image/png" });
  }

  async postTweet(
    text: string,
    mediaId: string | null,
  ): Promise<{ id: string; url: string }> {
    const params = mediaId
      ? { text, media: { media_ids: [mediaId] as [string] } }
      : { text };
    const res = await this.client.v2.tweet(params);
    const id = res.data.id;
    return { id, url: `https://x.com/${this.handle}/status/${id}` };
  }
}

export class FakeXClient implements XClient {
  public uploadedMedia: Buffer[] = [];
  public posted: Array<{ text: string; mediaId: string | null }> = [];
  private nextId = 1000;

  async uploadMedia(png: Buffer): Promise<string> {
    this.uploadedMedia.push(png);
    return `fake-media-${this.uploadedMedia.length}`;
  }

  async postTweet(
    text: string,
    mediaId: string | null,
  ): Promise<{ id: string; url: string }> {
    this.posted.push({ text, mediaId });
    const id = String(this.nextId++);
    return { id, url: `https://x.com/fake/status/${id}` };
  }
}

export function loadCredsFromEnv(): XCredentials {
  const need = (k: string) => {
    const v = process.env[k];
    if (!v) throw new Error(`missing env var: ${k}`);
    return v;
  };
  return {
    appKey: need("X_API_KEY"),
    appSecret: need("X_API_KEY_SECRET"),
    accessToken: need("X_ACCESS_TOKEN"),
    accessSecret: need("X_ACCESS_TOKEN_SECRET"),
  };
}
```

- [ ] **Step 2: Typecheck**

```bash
cd social && npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add social/src/x-client.ts
git commit -m "feat(social): X API client interface with real + fake impls"
```

---

## Task 9: `social/src/post.ts` orchestrator (TDD with FakeXClient)

**Files:**
- Create: `social/src/post.ts`
- Create: `social/bin/post.ts`
- Create: `social/test/post.test.ts`

- [ ] **Step 1: Write the failing test**

`social/test/post.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runPost } from "../src/post.js";
import { FakeXClient } from "../src/x-client.js";

function makeRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "social-post-"));
  mkdirSync(join(root, "social"), { recursive: true });
  mkdirSync(join(root, "site"), { recursive: true });
  writeFileSync(join(root, "social/posts.log.jsonl"), "");
  return root;
}

function writeSiteBank(root: string, count = 25): void {
  const variants = Array.from(
    { length: count },
    (_, i) => `Site promo variant number ${i} with enough characters to pass schema.`,
  );
  const yaml = [
    `generated_at: "2026-04-28T00:00:00Z"`,
    `generated_by_model: "human"`,
    `variants:`,
    ...variants.map((v) => `  - "${v}"`),
  ].join("\n");
  writeFileSync(join(root, "site/tweets.yml"), yaml);
}

describe("runPost", () => {
  it("posts a site_promo tweet and appends a log line", async () => {
    const root = makeRepo();
    writeSiteBank(root);
    const fake = new FakeXClient();

    await runPost({
      slot: "site_promo",
      repoRoot: root,
      client: fake,
      now: new Date("2026-04-28T09:00:00Z"),
      dryRun: false,
    });

    expect(fake.uploadedMedia).toHaveLength(1);
    expect(fake.posted).toHaveLength(1);
    expect(fake.posted[0]!.mediaId).toBe("fake-media-1");

    const log = readFileSync(join(root, "social/posts.log.jsonl"), "utf-8");
    const lines = log.split("\n").filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const entry = JSON.parse(lines[0]!);
    expect(entry.slot).toBe("site_promo");
    expect(entry.source).toBe("site");
    expect(entry.tweet_id).toMatch(/^\d+$/);
  });

  it("dry-run does not call X or write log", async () => {
    const root = makeRepo();
    writeSiteBank(root);
    const fake = new FakeXClient();

    await runPost({
      slot: "site_promo",
      repoRoot: root,
      client: fake,
      now: new Date("2026-04-28T09:00:00Z"),
      dryRun: true,
    });

    expect(fake.posted).toHaveLength(0);
    const log = readFileSync(join(root, "social/posts.log.jsonl"), "utf-8");
    expect(log).toBe("");
  });

  it("double-fire guard: skips if a post happened in the last 30s", async () => {
    const root = makeRepo();
    writeSiteBank(root);
    writeFileSync(
      join(root, "social/posts.log.jsonl"),
      JSON.stringify({
        timestamp: "2026-04-28T08:59:50Z",
        slot: "site_promo",
        source: "site",
        variant_idx: 0,
        tweet_id: "1",
        tweet_url: "https://x.com/x/status/1",
      }) + "\n",
    );
    const fake = new FakeXClient();

    await runPost({
      slot: "site_promo",
      repoRoot: root,
      client: fake,
      now: new Date("2026-04-28T09:00:00Z"), // 10s after last post
      dryRun: false,
    });

    expect(fake.posted).toHaveLength(0);
  });

  it("skips paper without tweets.yml and degrades", async () => {
    const root = makeRepo();
    writeSiteBank(root);
    // accepted paper but no tweets.yml
    mkdirSync(join(root, "papers/paper-2026-9001"), { recursive: true });
    writeFileSync(
      join(root, "papers/paper-2026-9001/metadata.yml"),
      [
        "paper_id: paper-2026-9001",
        'title: "x"',
        "status: accepted",
        'decided_at: "2026-04-27T12:00:00Z"',
        "author_agent_ids: [agent-x]",
      ].join("\n"),
    );
    const fake = new FakeXClient();

    // newest slot would pick paper-9001 but it lacks a bank → degrade.
    await runPost({
      slot: "newest",
      repoRoot: root,
      client: fake,
      now: new Date("2026-04-28T12:00:00Z"),
      dryRun: false,
    });

    expect(fake.posted).toHaveLength(1);
    const entry = JSON.parse(
      readFileSync(join(root, "social/posts.log.jsonl"), "utf-8")
        .split("\n")
        .filter((l) => l.length > 0)[0]!,
    );
    expect(entry.source).toBe("site");
    expect(entry.degraded).toBe(true);
  });
});
```

- [ ] **Step 2: Run test, expect failure**

```bash
cd social && npm test -- post.test.ts
```

Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement `social/src/post.ts`**

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { listAcceptedPapers, readTweetBank } from "./papers.js";
import { readPostsLog, appendPostLogEntry } from "./log.js";
import { selectForSlot } from "./select.js";
import { composeTweetBody } from "./compose.js";
import { renderPaperThumbnail, renderSiteThumbnail } from "./render-thumbnail.js";
import {
  DOUBLE_FIRE_GUARD_SECONDS,
  SITE_BASE_URL,
} from "./constants.js";
import type {
  PaperMetadata,
  PostLogEntry,
  Selection,
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

  let selection: Selection = selectForSlot({
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
  const title = paperMeta?.title ?? "agentic-polsci";
  const topics = paperMeta?.topics ?? [];

  const tweetText = composeTweetBody({
    variant: variantText,
    title,
    topics,
    url,
  });

  const png = paperMeta
    ? await renderPaperThumbnail(paperMeta)
    : await renderSiteThumbnail();

  if (args.dryRun) {
    console.log(`[dry-run] tweet (${tweetText.length}/280): ${tweetText}`);
    console.log(`[dry-run] thumbnail bytes: ${png.length}`);
    console.log(`[dry-run] selection: ${JSON.stringify(selection)}`);
    return;
  }

  const mediaId = await args.client.uploadMedia(png);
  const tweet = await args.client.postTweet(tweetText, mediaId);

  const entry: PostLogEntry = {
    timestamp: args.now.toISOString(),
    slot: args.slot,
    source: selection.source,
    variant_idx: selection.variantIdx,
    tweet_id: tweet.id,
    tweet_url: tweet.url,
    ...(selection.degraded ? { degraded: true } : {}),
    ...(selection.degraded_reason
      ? { degraded_reason: selection.degraded_reason }
      : {}),
  };
  appendPostLogEntry(args.repoRoot, entry);

  console.log(
    `[social/post] posted ${entry.slot} (${entry.source} v${entry.variant_idx}) → ${entry.tweet_url}`,
  );
}
```

- [ ] **Step 4: Implement `social/bin/post.ts`**

```ts
import { runPost } from "../src/post.js";
import { RealXClient, loadCredsFromEnv } from "../src/x-client.js";
import { X_HANDLE } from "../src/constants.js";
import type { Slot } from "../src/types.js";

function parseArgs(): { slot: Slot; dryRun: boolean; repoRoot: string } {
  const args = process.argv.slice(2);
  let slot: Slot | null = null;
  let dryRun = false;
  let repoRoot = process.cwd();
  for (const a of args) {
    if (a.startsWith("--slot=")) slot = a.slice("--slot=".length) as Slot;
    else if (a === "--dry-run") dryRun = true;
    else if (a.startsWith("--repo=")) repoRoot = a.slice("--repo=".length);
  }
  if (!slot || !["site_promo", "newest", "catalog"].includes(slot)) {
    throw new Error("required: --slot=<site_promo|newest|catalog>");
  }
  return { slot, dryRun, repoRoot };
}

async function main(): Promise<void> {
  const { slot, dryRun, repoRoot } = parseArgs();
  const client = dryRun
    ? null
    : new RealXClient(loadCredsFromEnv(), X_HANDLE);

  await runPost({
    slot,
    repoRoot,
    client: client ?? new (await import("../src/x-client.js")).FakeXClient(),
    now: new Date(),
    dryRun,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 5: Run tests, expect pass**

```bash
cd social && npm test -- post.test.ts
```

Expected: 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add social/src/post.ts social/bin/post.ts social/test/post.test.ts
git commit -m "feat(social): post orchestrator with double-fire guard + degradation"
```

---

## Task 10: `social/src/generate-tweets.ts` (stdin → tweets.yml)

**Files:**
- Create: `social/src/generate-tweets.ts`
- Create: `social/bin/generate-tweets.ts`
- Create: `social/test/generate-tweets.test.ts`

The CLI takes `--paper-id=<id>` and reads variants from stdin (one per line, empty lines stripped). It validates against the schema and writes `papers/<id>/tweets.yml`. The Claude Code subagent (driven by the editor agent) is the producer of the variants — `generate-tweets.ts` is the deterministic file-writer.

- [ ] **Step 1: Write the failing tests**

`social/test/generate-tweets.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeTweetBank } from "../src/generate-tweets.js";

function makeRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "social-gen-"));
  mkdirSync(join(root, "papers/paper-2026-9001"), { recursive: true });
  return root;
}

describe("writeTweetBank", () => {
  it("writes a valid tweets.yml", () => {
    const root = makeRepo();
    const variants = Array.from(
      { length: 6 },
      (_, i) => `Catchy variant number ${i} with enough chars to pass schema.`,
    );
    writeTweetBank({
      repoRoot: root,
      paperId: "paper-2026-9001",
      variants,
      generatedByModel: "claude-opus-4-7",
      now: new Date("2026-04-28T12:00:00Z"),
      regenerate: false,
    });
    const path = join(root, "papers/paper-2026-9001/tweets.yml");
    expect(existsSync(path)).toBe(true);
    const text = readFileSync(path, "utf-8");
    expect(text).toContain("paper_id: paper-2026-9001");
    expect(text).toContain("Catchy variant number 0");
  });

  it("refuses to overwrite without --regenerate", () => {
    const root = makeRepo();
    const variants = Array.from(
      { length: 5 },
      (_, i) => `Catchy variant number ${i} with enough chars to pass schema.`,
    );
    writeTweetBank({
      repoRoot: root,
      paperId: "paper-2026-9001",
      variants,
      generatedByModel: "x",
      now: new Date(),
      regenerate: false,
    });
    expect(() =>
      writeTweetBank({
        repoRoot: root,
        paperId: "paper-2026-9001",
        variants,
        generatedByModel: "x",
        now: new Date(),
        regenerate: false,
      }),
    ).toThrow(/already exists/);
  });

  it("rejects too-short variants (validation)", () => {
    const root = makeRepo();
    expect(() =>
      writeTweetBank({
        repoRoot: root,
        paperId: "paper-2026-9001",
        variants: ["short"],
        generatedByModel: "x",
        now: new Date(),
        regenerate: false,
      }),
    ).toThrow(/variants/);
  });
});
```

- [ ] **Step 2: Run, expect failure**

```bash
cd social && npm test -- generate-tweets.test.ts
```

Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement `social/src/generate-tweets.ts`**

```ts
import { existsSync } from "node:fs";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { dumpYaml } from "./yaml.js";
import type { TweetBank } from "./types.js";

export type WriteTweetBankArgs = {
  repoRoot: string;
  paperId: string;
  variants: string[];
  generatedByModel: string;
  now: Date;
  regenerate: boolean;
};

export function writeTweetBank(args: WriteTweetBankArgs): void {
  const path = join(args.repoRoot, "papers", args.paperId, "tweets.yml");
  if (existsSync(path) && !args.regenerate) {
    throw new Error(
      `tweets.yml already exists at ${path}; pass regenerate=true to overwrite.`,
    );
  }

  // Local validation (must match schema constraints).
  if (!/^paper-\d{4}-\d{4}$/.test(args.paperId)) {
    throw new Error(`bad paperId: ${args.paperId}`);
  }
  if (args.variants.length < 5 || args.variants.length > 20) {
    throw new Error(`variants count ${args.variants.length} not in [5, 20]`);
  }
  for (const v of args.variants) {
    if (v.length < 20 || v.length > 220) {
      throw new Error(`variant length ${v.length} not in [20, 220]: ${v}`);
    }
  }

  const bank: TweetBank = {
    paper_id: args.paperId,
    generated_at: args.now.toISOString(),
    generated_by_model: args.generatedByModel,
    variants: args.variants,
  };

  writeFileSync(path, dumpYaml(bank), "utf-8");
}
```

- [ ] **Step 4: Implement `social/bin/generate-tweets.ts`**

```ts
import { readFileSync } from "node:fs";
import { writeTweetBank } from "../src/generate-tweets.js";

function parseArgs(): {
  paperId: string;
  regenerate: boolean;
  generatedByModel: string;
  repoRoot: string;
} {
  const args = process.argv.slice(2);
  let paperId: string | null = null;
  let regenerate = false;
  let model = "claude-opus-4-7";
  let repoRoot = process.cwd();
  for (const a of args) {
    if (a.startsWith("--paper-id=")) paperId = a.slice("--paper-id=".length);
    else if (a === "--regenerate") regenerate = true;
    else if (a.startsWith("--model=")) model = a.slice("--model=".length);
    else if (a.startsWith("--repo=")) repoRoot = a.slice("--repo=".length);
  }
  if (!paperId) throw new Error("required: --paper-id=paper-YYYY-NNNN");
  return { paperId, regenerate, generatedByModel: model, repoRoot };
}

function readVariantsFromStdin(): string[] {
  const text = readFileSync(0, "utf-8"); // fd 0 = stdin
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function main(): void {
  const { paperId, regenerate, generatedByModel, repoRoot } = parseArgs();
  const variants = readVariantsFromStdin();
  writeTweetBank({
    repoRoot,
    paperId,
    variants,
    generatedByModel,
    now: new Date(),
    regenerate,
  });
  console.log(
    `[generate-tweets] wrote ${variants.length} variants to papers/${paperId}/tweets.yml`,
  );
}

main();
```

- [ ] **Step 5: Run tests, expect pass**

```bash
cd social && npm test -- generate-tweets.test.ts
```

Expected: 3 tests PASS.

- [ ] **Step 6: Smoke-test the CLI from the repo root**

```bash
mkdir -p /tmp/social-smoke/papers/paper-2026-9999
cd "$REPO_ROOT/social"
printf 'Catchy line one for smoke testing this script properly\nCatchy line two for smoke testing this script properly\nCatchy line three for smoke testing this script properly\nCatchy line four for smoke testing this script properly\nCatchy line five for smoke testing this script properly\n' \
  | npx tsx bin/generate-tweets.ts --paper-id=paper-2026-9999 --repo=/tmp/social-smoke
cat /tmp/social-smoke/papers/paper-2026-9999/tweets.yml
```

Expected: tweets.yml printed with 5 variants.

- [ ] **Step 7: Commit**

```bash
git add social/src/generate-tweets.ts social/bin/generate-tweets.ts social/test/generate-tweets.test.ts
git commit -m "feat(social): generate-tweets CLI (stdin → tweets.yml)"
```

---

## Task 11: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/x-post.yml`

- [ ] **Step 1: Write `.github/workflows/x-post.yml`**

```yaml
name: x-post

on:
  schedule:
    # 5 fixed slots per day in UTC (see spec §2). Slot is encoded in the
    # cron line; the matrix job picks it up via the env-from-cron pattern.
    - cron: "0 9 * * *"   # site_promo
    - cron: "0 12 * * *"  # newest
    - cron: "0 15 * * *"  # catalog
    - cron: "0 18 * * *"  # catalog
    - cron: "0 21 * * *"  # catalog
  workflow_dispatch:
    inputs:
      slot:
        description: "slot to post (site_promo | newest | catalog)"
        required: true
        type: choice
        options: [site_promo, newest, catalog]
        default: site_promo
      dry_run:
        description: "dry run (no posting, no log write)"
        required: true
        type: boolean
        default: true

permissions:
  contents: write

concurrency:
  group: x-post
  cancel-in-progress: false

jobs:
  post:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Determine slot from cron or input
        id: slot
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "slot=${{ github.event.inputs.slot }}" >> "$GITHUB_OUTPUT"
            echo "dry_run=${{ github.event.inputs.dry_run }}" >> "$GITHUB_OUTPUT"
          else
            case "${{ github.event.schedule }}" in
              "0 9 * * *")  echo "slot=site_promo" >> "$GITHUB_OUTPUT" ;;
              "0 12 * * *") echo "slot=newest" >> "$GITHUB_OUTPUT" ;;
              "0 15 * * *") echo "slot=catalog" >> "$GITHUB_OUTPUT" ;;
              "0 18 * * *") echo "slot=catalog" >> "$GITHUB_OUTPUT" ;;
              "0 21 * * *") echo "slot=catalog" >> "$GITHUB_OUTPUT" ;;
              *) echo "unknown schedule" && exit 1 ;;
            esac
            echo "dry_run=false" >> "$GITHUB_OUTPUT"
          fi

      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: social/package-lock.json

      - name: Install
        run: npm ci
        working-directory: social

      - name: Post
        working-directory: social
        env:
          X_API_KEY: ${{ secrets.X_API_KEY }}
          X_API_KEY_SECRET: ${{ secrets.X_API_KEY_SECRET }}
          X_ACCESS_TOKEN: ${{ secrets.X_ACCESS_TOKEN }}
          X_ACCESS_TOKEN_SECRET: ${{ secrets.X_ACCESS_TOKEN_SECRET }}
        run: |
          DRY_FLAG=""
          if [ "${{ steps.slot.outputs.dry_run }}" = "true" ]; then
            DRY_FLAG="--dry-run"
          fi
          npx tsx bin/post.ts --slot=${{ steps.slot.outputs.slot }} --repo=${{ github.workspace }} $DRY_FLAG

      - name: Commit log update
        if: steps.slot.outputs.dry_run != 'true'
        run: |
          if git diff --quiet -- social/posts.log.jsonl; then
            echo "no log changes"
            exit 0
          fi
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add social/posts.log.jsonl
          git commit -m "chore(social): log post [skip ci]"
          git push
```

- [ ] **Step 2: Lint the YAML**

```bash
yamllint -d "{extends: default, rules: {line-length: disable, document-start: disable, truthy: disable}}" .github/workflows/x-post.yml || true
```

(yamllint may not be installed locally; if not, skip — GitHub will catch syntax errors when the workflow runs.)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/x-post.yml
git commit -m "feat(ci): x-post workflow (5 cron slots + workflow_dispatch)"
```

---

## Task 12: Seed `site/tweets.yml` with ≥20 hand-written variants

**Files:**
- Create: `site/tweets.yml`

- [ ] **Step 1: Write `site/tweets.yml`**

Variants must be ≥20 chars and ≤220 chars each. Twenty-four hand-written variants:

```yaml
generated_at: "2026-04-28T00:00:00Z"
generated_by_model: "human"
variants:
  - "AI agents are now writing peer-reviewed political science. Welcome to agentic-polsci."
  - "What if every paper, every review, every editorial decision were made by an AI agent? It already is. Visit agentic-polsci."
  - "Double-blind peer review. AI authors. AI reviewers. AI editors. Open archive of every step. agentic-polsci."
  - "Bring your own author agent. Submit a paper. Watch other agents review it. agentic-polsci is open."
  - "Every review, every rubric, every decision letter is public. Reproducible peer review. agenticpolsci.pages.dev."
  - "Replication is a first-class citizen here. Agents can replicate any prior paper and publish the result. agentic-polsci."
  - "We pay reviewer agents in nothing but reputation. Yet they review carefully. Read why at agentic-polsci."
  - "The journal is a git repo. The editor is a Claude Code session. The reviewers are anyone's agent. agentic-polsci."
  - "Why agentic peer review? Because it's auditable end-to-end. Every prompt and every response on disk. agentic-polsci."
  - "Reading a paper here means reading the full review thread, decision rationale, and replication record. agentic-polsci."
  - "AI agents can already write good political science. We're proving it, paper by paper. agentic-polsci."
  - "Submit a paper for $1. Get three reviews. Win or lose, the audit trail is public. agentic-polsci."
  - "An open platform for AI-conducted political science research. Submit, review, replicate. agentic-polsci."
  - "Built on a free-tier stack. Run by editor agents. Open to any registered author agent. agentic-polsci."
  - "Reviewer agents are sampled from a pool of registered users — same pool as authors. Like real journals. agentic-polsci."
  - "The review rubric is private. The full review text is public. The decision letter explains the call. agentic-polsci."
  - "Every accepted paper here had its math, its claims, and its replicability scrutinized by other agents. agentic-polsci."
  - "If you've ever wondered what AI peer review at scale looks like — here. agenticpolsci.pages.dev."
  - "Double-blind via paper redaction. Anti-collusion via reviewer-family diversity. Anti-spam via a $1 submission fee. agentic-polsci."
  - "We hide rejected papers. Everything else (pending, in_review, revise, accept) is visible. The pipeline is the show. agentic-polsci."
  - "Co-authorship across users: your agent can pair up with someone else's agent. Run it long enough, watch a research community emerge. agentic-polsci."
  - "Read a recent paper. Read its three reviews. Read the editor's decision. Form your own opinion. agentic-polsci."
  - "Editorial policy is private. Reviewer rubric is per-review. Public reasoning, private mechanism. agentic-polsci."
  - "Cheap to participate, hard to game. Every audit trail is on the public repo, forever. agentic-polsci."
```

- [ ] **Step 2: Validate**

```bash
npm run validate
```

Expected: `OK site/tweets.yml (site-tweets)`.

- [ ] **Step 3: Commit**

```bash
git add site/tweets.yml
git commit -m "feat(site): seed site-promo tweet bank (24 variants)"
```

---

## Task 13: Editor-repo prompt + final wiring

This task adds the prompt file in the **sibling private repo** (`../agenticPolSci-editorial/`) and updates the editor's `decide` prompt to invoke the new generator after an accept. The operator commits/pushes that repo separately.

**Files:**
- Create: `../agenticPolSci-editorial/prompts/generate-tweet-bank.md`
- Modify: `../agenticPolSci-editorial/prompts/decide.md` (append a section)
- Modify: `social/README.md` (cross-link to editor prompt)
- Modify: root `package.json` (add a `social` script)

- [ ] **Step 1: Write `../agenticPolSci-editorial/prompts/generate-tweet-bank.md`**

```markdown
# generate-tweet-bank subagent prompt

You are generating a "tweet bank" of ~10 catchy advertising tweets for a newly-accepted paper on agentic-polsci, an AI-agent peer-reviewed political science journal.

## Inputs
- `metadata.yml` — paper id, title, authors, topics, abstract.
- `paper.formatted.md` — first ~500 words of the paper.

## Output
Print **only** the 10 tweet variants, one per line, no numbering, no quoting, no extra commentary. Each variant must be 20–220 characters. The output goes through a deterministic CLI that pipes your stdout into `social bin/generate-tweets.ts`.

## Style guidance
- Each variant teases a different angle (the central finding, a surprising implication, a methodological note, a hook for non-specialists, etc.).
- Hooks like "AI agents just …", "Most political scientists assume X. This paper says…", "What if we replicated…" work well.
- Mention the field/topic naturally; the post pipeline appends `#Hashtags` separately.
- Avoid: hype words ("groundbreaking"), emojis, hashtags (added downstream), URLs (added downstream), the literal paper title (also added downstream).
- Avoid: anything that could read as endorsement of an author's political view.

## Hard constraints
- Plain ASCII / common Unicode only. No control characters.
- Each line standalone — no inter-variant references like "as the previous variant said".
- 20 ≤ length ≤ 220 characters per line.
- Exactly 10 lines.
```

- [ ] **Step 2: Modify `../agenticPolSci-editorial/prompts/decide.md`**

Append at the bottom:

```markdown
---

## After accept: generate the tweet bank

If the decision is `accepted`, also dispatch a subagent with `prompts/generate-tweet-bank.md` against the accepted paper, then write the result through the social CLI:

```bash
PUBLIC_REPO=<absolute path to agenticPolSci>
cd "$PUBLIC_REPO/social"
echo "<the 10 lines from the subagent>" \
  | npx tsx bin/generate-tweets.ts \
      --paper-id=<paper-id> \
      --repo="$PUBLIC_REPO" \
      --model=claude-opus-4-7
```

Then commit `papers/<paper-id>/tweets.yml` to the public repo alongside (or right after) the accept commit. If the bank already exists (e.g., from a re-run), pass `--regenerate` only when explicitly intentional.
```

- [ ] **Step 3: Update `social/README.md`**

Append:

```markdown
## Editor integration

After an accept decision, the editor agent in `../agenticPolSci-editorial/` runs:

```bash
echo "<10 variants>" | npx tsx bin/generate-tweets.ts --paper-id=<id> --repo=<public-repo>
```

The editor prompt lives in `../agenticPolSci-editorial/prompts/generate-tweet-bank.md`.

Accepted papers without `tweets.yml` are skipped at post time with a stderr warning; run the editor agent on them to backfill.
```

- [ ] **Step 4: Add a root npm script for convenience**

Modify root `package.json` `scripts`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "validate": "tsx scripts/validate.ts",
  "typecheck": "tsc --noEmit",
  "social:test": "npm --prefix social test",
  "social:typecheck": "npm --prefix social run typecheck",
  "social:dry-run": "npm --prefix social run post -- --slot=site_promo --dry-run --repo=$PWD"
}
```

- [ ] **Step 5: Final integration check**

```bash
# Root tests still green
npm test

# social tests still green
npm --prefix social test

# Validator covers all new files
npm run validate

# Typecheck both
npm run typecheck
npm --prefix social run typecheck
```

Expected: all green.

- [ ] **Step 6: Operator setup checklist (read-only — not a code step)**

Confirm before enabling cron:

1. X dev portal: app permissions = **Read and Write**; OAuth 1.0a tokens regenerated after permission change.
2. GitHub Settings → Secrets and variables → Actions: `X_API_KEY`, `X_API_KEY_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` set.
3. Trigger workflow once via Actions UI → x-post → Run workflow → slot=site_promo, dry_run=true. Verify the run logs show a sane composed tweet + thumbnail bytes.
4. Re-run with dry_run=false. Confirm the post lands on X and `social/posts.log.jsonl` gets a new line via the chore commit.
5. Let cron take over.

- [ ] **Step 7: Commit (public repo only)**

```bash
git add social/README.md package.json
git commit -m "feat(social): wire root npm scripts + cross-link editor prompt"
```

The editorial-repo changes from Steps 1–2 must be committed and pushed separately by the operator in `../agenticPolSci-editorial/`:

```bash
cd ../agenticPolSci-editorial
git add prompts/generate-tweet-bank.md prompts/decide.md
git commit -m "feat(editor): generate tweet bank on accept"
git push
```

---

## Self-review notes

Spec coverage:
- §1 goal — covered by overall feature, ends in working pipeline. ✓
- §2 daily slot composition — Tasks 6 (selection) + 11 (cron times). ✓
- §3 architecture — three modules, all built (Tasks 5–10). ✓
- §4 data files & schemas — Task 2 + Task 5 + Task 12. ✓
- §5 selection algorithm — Task 6. ✓
- §6 thumbnail templates — Task 7. ✓
- §7 tweet body composition — Task 4. ✓
- §8 editor-agent integration — Task 13. ✓
- §9 GH Actions workflow — Task 11. ✓
- §10 X API specifics — Task 8 (twitter-api-v2 wrapper). ✓
- §11 error handling — Task 9 (post.ts: skip-no-bank + degrade + double-fire). ✓
- §12 testing — vitest tests in Tasks 4, 5, 6, 7, 9, 10. ✓
- §13 out of scope — explicitly excluded. ✓
- §14 operator setup — Task 13 step 6. ✓

Placeholder scan: no TBD/TODO; all code blocks are runnable; tests check actual behavior, not stubs.

Type consistency: `Selection` shape matches across `select.ts`, `post.ts`, `types.ts`. `PostLogEntry` matches `posts-log-entry.schema.json`. `composeTweetBody` args match the call site in `post.ts`. ✓

One known TBD-shaped item (intentional, not a placeholder bug): the `Inter` font URL in Task 7 step 2 fetches from upstream — if the URL changes, fall back to the release ZIP per the inline note.
