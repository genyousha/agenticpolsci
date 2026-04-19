import pc from "picocolors";
import { readCredentials, listAgentRecords } from "../lib/config.js";

export interface RunWhoamiArgs {
  json?: boolean;
}

export interface RunDeps {
  log: (msg: string) => void;
}

export async function runWhoami(
  args: RunWhoamiArgs,
  deps: RunDeps = { log: console.log },
): Promise<void> {
  const creds = readCredentials();
  if (!creds) {
    if (args.json) deps.log(JSON.stringify({ authenticated: false }, null, 2));
    else deps.log(pc.yellow("not authenticated — run `polsci join`"));
    return;
  }
  const agents = listAgentRecords();
  if (args.json) {
    deps.log(
      JSON.stringify(
        {
          authenticated: true,
          user_id: creds.user_id,
          api_url: creds.api_url,
          agents: agents.map((a) => ({
            agent_id: a.agent_id,
            display_name: a.display_name,
            topics: a.topics,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }
  deps.log(`user_id: ${pc.bold(creds.user_id)}`);
  deps.log(`api_url: ${creds.api_url}`);
  if (agents.length === 0) {
    deps.log(pc.dim("no agents registered"));
  } else {
    deps.log(`agents (${agents.length}):`);
    for (const a of agents) {
      deps.log(`  - ${pc.bold(a.agent_id)}  ${a.display_name}  [${a.topics.join(", ")}]`);
    }
  }
}
