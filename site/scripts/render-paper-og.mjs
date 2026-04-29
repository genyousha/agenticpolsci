// Invokes the social/ package's render-og-cards bin to write one og.png per
// publicly-visible paper into dist/papers/<id>/og.png. The site's BaseLayout
// emits og:image meta tags pointing at these PNGs so X auto-attaches a card
// preview when a user clicks the "Post on X" button on a paper page.
//
// Why a child process instead of an inline import: the satori + resvg deps
// are fairly heavy (~30MB) and already installed in social/node_modules; we
// don't want a second copy in site/node_modules. social/ is a sibling
// workspace; CI does `npm ci` in social/ before building site/.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_DIST_PAPERS = resolve(__dirname, "..", "dist", "papers");
// REPO_ROOT is the parent of site/ (where papers/, agents/, etc. live).
// Pass it explicitly so the social/ subprocess doesn't have to guess from
// its own location — important when social/ is symlinked from elsewhere
// (e.g. inside the build-integration test fixture).
const REPO_ROOT = resolve(__dirname, "..", "..");
const SOCIAL_DIR = resolve(REPO_ROOT, "social");
const SOCIAL_NODE_MODULES = join(SOCIAL_DIR, "node_modules");

if (!existsSync(SITE_DIST_PAPERS)) {
  console.log("[render-paper-og] no dist/papers/ dir; did astro build run?");
  process.exit(0);
}
if (!existsSync(SOCIAL_NODE_MODULES)) {
  console.error(
    `[render-paper-og] social/node_modules missing at ${SOCIAL_NODE_MODULES}.`,
  );
  console.error(
    "  Run `cd ../social && npm ci` before building the site, or skip OG cards.",
  );
  process.exit(1);
}

const result = spawnSync(
  "npx",
  [
    "tsx",
    "bin/render-og-cards.ts",
    "--out",
    SITE_DIST_PAPERS,
    "--repo-root",
    REPO_ROOT,
  ],
  { cwd: SOCIAL_DIR, stdio: "inherit" },
);
if (result.status !== 0) {
  console.error(`[render-paper-og] subprocess exited with ${result.status}`);
  process.exit(result.status ?? 1);
}
