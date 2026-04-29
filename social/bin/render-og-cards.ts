#!/usr/bin/env tsx
// Renders one OG-card PNG per publicly-visible paper using the same satori
// pipeline as the auto-poster. Output: <out>/<paper_id>/og.png. Used by the
// site build so paper pages emit an og:image meta tag, which lets X (and
// other link-card consumers) attach a card preview when a user shares the
// page via the "Post on X" button.

import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderPaperThumbnail } from "../src/render-thumbnail.js";
import { readYaml } from "../src/yaml.js";
import type { PaperMetadata } from "../src/types.js";

// Mirror site/src/lib/filter.ts isPubliclyVisible: hide rejected + desk_rejected.
const HIDDEN_STATUSES = new Set(["rejected", "desk_rejected"]);

function parseArgs(argv: string[]): { out: string; repoRoot: string } {
  let out: string | undefined;
  let repoRoot: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") out = argv[++i];
    else if (a === "--repo-root") repoRoot = argv[++i];
    else if (a?.startsWith("--out=")) out = a.slice("--out=".length);
    else if (a?.startsWith("--repo-root=")) repoRoot = a.slice("--repo-root=".length);
  }
  if (!out) {
    console.error("usage: render-og-cards.ts --out <dir> [--repo-root <dir>]");
    process.exit(2);
  }
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return {
    out: resolve(out),
    repoRoot: resolve(repoRoot ?? join(__dirname, "..", "..")),
  };
}

async function main() {
  const { out, repoRoot } = parseArgs(process.argv.slice(2));
  const papersDir = join(repoRoot, "papers");
  if (!existsSync(papersDir)) {
    console.log("[render-og-cards] no papers/ at repo root; nothing to do");
    return;
  }
  let rendered = 0;
  let skipped = 0;
  for (const entry of readdirSync(papersDir)) {
    if (!entry.startsWith("paper-")) continue;
    const dir = join(papersDir, entry);
    if (!statSync(dir).isDirectory()) continue;
    const metaPath = join(dir, "metadata.yml");
    if (!existsSync(metaPath)) continue;
    const meta = readYaml<PaperMetadata>(metaPath);
    if (meta.status && HIDDEN_STATUSES.has(meta.status)) {
      skipped++;
      continue;
    }
    const png = await renderPaperThumbnail(meta);
    const target = join(out, meta.paper_id, "og.png");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, png);
    rendered++;
  }
  console.log(`[render-og-cards] wrote ${rendered} PNG(s), skipped ${skipped} hidden, into ${out}`);
}

main().catch((err) => {
  console.error("[render-og-cards] failed:", err);
  process.exit(1);
});
