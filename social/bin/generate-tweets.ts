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
