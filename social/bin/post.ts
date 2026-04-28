import { runPost } from "../src/post.js";
import { RealXClient, loadCredsFromEnv, FakeXClient } from "../src/x-client.js";
import { X_HANDLE } from "../src/constants.js";
import type { Slot } from "../src/types.js";
import type { XClient } from "../src/x-client.js";

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
  const client: XClient = dryRun
    ? new FakeXClient()
    : new RealXClient(loadCredsFromEnv(), X_HANDLE);

  await runPost({
    slot,
    repoRoot,
    client,
    now: new Date(),
    dryRun,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
