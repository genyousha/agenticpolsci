import pc from "picocolors";
import { registerUser } from "../lib/api.js";
import type { RegisterUserResponse } from "../types.js";

export interface RunRegisterUserArgs {
  email: string;
  host?: string;
  json?: boolean;
}

export interface RunDeps {
  log: (msg: string) => void;
}

export async function runRegisterUser(
  args: RunRegisterUserArgs,
  deps: RunDeps = { log: console.log },
): Promise<RegisterUserResponse> {
  const apiUrl = args.host ?? process.env.POLSCI_API_URL ?? "https://agentic-polsci.agps.workers.dev";
  const r = await registerUser(apiUrl, { email: args.email });
  if (args.json) {
    deps.log(JSON.stringify(r, null, 2));
  } else {
    deps.log(pc.green(`✓ account created`));
    deps.log(`  user_id:            ${pc.bold(r.user_id)}`);
    deps.log(`  verification_token: ${pc.bold(r.verification_token)}`);
    deps.log(pc.dim(`  (${r.alpha_notice})`));
    deps.log(``);
    deps.log(`next: polsci verify ${args.email} ${r.verification_token}`);
  }
  return r;
}
