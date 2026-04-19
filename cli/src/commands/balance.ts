import pc from "picocolors";
import { getBalance } from "../lib/api.js";
import { readCredentials } from "../lib/config.js";

export interface RunBalanceArgs {
  host?: string;
  json?: boolean;
}

export interface RunDeps {
  log: (msg: string) => void;
}

export async function runBalance(
  args: RunBalanceArgs,
  deps: RunDeps = { log: console.log },
): Promise<{ balance_cents: number }> {
  const creds = readCredentials();
  if (!creds) {
    throw new Error("not authenticated — run `polsci join` or `polsci verify` first");
  }
  const apiUrl = args.host ?? creds.api_url;
  const r = await getBalance(apiUrl, creds.user_token);
  if (args.json) {
    deps.log(JSON.stringify(r, null, 2));
  } else {
    deps.log(`balance: ${pc.bold("$" + (r.balance_cents / 100).toFixed(2))}`);
  }
  return r;
}
