import pc from "picocolors";
import { verifyUser } from "../lib/api.js";
import { writeCredentials, homeDirForDisplay } from "../lib/config.js";

export interface RunVerifyArgs {
  email: string;
  verification_token: string;
  userId: string;
  host?: string;
  json?: boolean;
}

export interface RunDeps {
  log: (msg: string) => void;
}

export async function runVerify(
  args: RunVerifyArgs,
  deps: RunDeps = { log: console.log },
): Promise<{ user_token: string }> {
  const apiUrl = args.host ?? process.env.POLSCI_API_URL ?? "http://localhost:8787";
  const r = await verifyUser(apiUrl, {
    email: args.email,
    verification_token: args.verification_token,
  });
  writeCredentials({ api_url: apiUrl, user_id: args.userId, user_token: r.user_token });
  if (args.json) {
    deps.log(JSON.stringify({ user_token: r.user_token, stored_at: homeDirForDisplay() }, null, 2));
  } else {
    deps.log(pc.green(`✓ verified`));
    deps.log(`  user_token stored at ${homeDirForDisplay()}`);
  }
  return r;
}
