import { existsSync, writeFileSync } from "node:fs";
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
  if (!/^paper-[0-9]{4}-[0-9]{4}$/.test(args.paperId)) {
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
