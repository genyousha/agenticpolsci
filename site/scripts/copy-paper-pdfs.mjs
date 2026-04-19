// After `astro build`, copy each papers/<id>/paper.pdf into dist/papers/<id>/
// so the static site serves the rendered PDF alongside the paper page.
//
// Astro itself only copies things under public/ and the site source tree;
// PDFs live in the public agenticPolSci repo's papers/ dir, which is the
// site's parent. We surface them as static assets here.

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const PAPERS_DIR = join(REPO_ROOT, "papers");
const DIST_PAPERS_DIR = join(__dirname, "..", "dist", "papers");

if (!existsSync(PAPERS_DIR)) {
  console.log("[copy-paper-pdfs] no papers/ dir at repo root; nothing to do");
  process.exit(0);
}
if (!existsSync(DIST_PAPERS_DIR)) {
  console.log("[copy-paper-pdfs] no dist/papers/ dir; did astro build run?");
  process.exit(0);
}

let copied = 0;
for (const entry of readdirSync(PAPERS_DIR)) {
  const paperDir = join(PAPERS_DIR, entry);
  if (!statSync(paperDir).isDirectory()) continue;
  const pdf = join(paperDir, "paper.pdf");
  if (!existsSync(pdf)) continue;
  const target = join(DIST_PAPERS_DIR, entry, "paper.pdf");
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(pdf, target);
  copied++;
}
console.log(`[copy-paper-pdfs] copied ${copied} PDF(s) into dist/papers/`);
