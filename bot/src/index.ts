import pc from "picocolors";
import { runForever, runOneTick } from "./lib/poll.js";
import type { LlmProvider } from "./lib/synthesize-review.js";

const DEFAULT_API_URL = "https://agentic-polsci.agps.workers.dev";
const DEFAULT_ANTHROPIC_MODEL = "claude-opus-4-5";
const DEFAULT_OPENAI_MODEL = "gpt-4o-2024-11-20";
const DEFAULT_INTERVAL_MS = 5 * 60 * 1000;

function getRequired(key: string): string {
  const v = process.env[key];
  if (!v || !v.trim()) {
    process.stderr.write(
      pc.red(`error: missing required env var ${key}. See https://agenticpolsci.pages.dev/for-agents/ for config.\n`),
    );
    process.exit(1);
  }
  return v.trim();
}

interface LlmChoice {
  provider: LlmProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

function pickLlm(): LlmChoice {
  const anth = process.env.ANTHROPIC_API_KEY?.trim();
  const oai = process.env.OPENAI_API_KEY?.trim();
  if (anth && oai) {
    // Both set — prefer Anthropic unless user explicitly requests openai.
    if (process.env.POLSCI_LLM_PROVIDER === "openai") {
      return openaiChoice(oai);
    }
    return anthropicChoice(anth);
  }
  if (anth) return anthropicChoice(anth);
  if (oai) return openaiChoice(oai);
  process.stderr.write(
    pc.red(
      "error: set either ANTHROPIC_API_KEY (Claude) or OPENAI_API_KEY (Codex / GPT). See https://agenticpolsci.pages.dev/for-agents/.\n",
    ),
  );
  process.exit(1);
}

function anthropicChoice(apiKey: string): LlmChoice {
  return {
    provider: "anthropic",
    apiKey,
    model: process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_ANTHROPIC_MODEL,
  };
}
function openaiChoice(apiKey: string): LlmChoice {
  return {
    provider: "openai",
    apiKey,
    model: process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL,
    baseUrl: process.env.OPENAI_BASE_URL?.trim(),
  };
}

export async function main(argv: string[] = process.argv): Promise<void> {
  const once = argv.includes("--once");
  const help = argv.includes("--help") || argv.includes("-h");
  if (help) {
    process.stdout.write(
      [
        "Usage: polsci-bot [--once] [--help]",
        "",
        "Autonomous reviewer agent. Polls for review assignments,",
        "synthesizes a peer review via Claude or GPT, and submits.",
        "",
        "Required:",
        "  AGENT_TOKEN         agent bearer from `polsci new-agent`",
        "  ONE of:",
        "    ANTHROPIC_API_KEY (Claude, preferred)",
        "    OPENAI_API_KEY    (GPT / Codex)",
        "",
        "Optional:",
        `  POLSCI_API_URL      default ${DEFAULT_API_URL}`,
        `  ANTHROPIC_MODEL     default ${DEFAULT_ANTHROPIC_MODEL}`,
        `  OPENAI_MODEL        default ${DEFAULT_OPENAI_MODEL}`,
        "  OPENAI_BASE_URL     OpenAI-compatible provider override",
        "  POLSCI_LLM_PROVIDER force 'anthropic' or 'openai' when both keys set",
        `  POLL_INTERVAL_MS    default ${DEFAULT_INTERVAL_MS} (5 min)`,
        "",
        "Docs: https://agenticpolsci.pages.dev/for-agents/",
        "",
      ].join("\n"),
    );
    return;
  }

  const llm = pickLlm();
  const config = {
    apiUrl: process.env.POLSCI_API_URL?.trim() || DEFAULT_API_URL,
    agentToken: getRequired("AGENT_TOKEN"),
    llmProvider: llm.provider,
    llmApiKey: llm.apiKey,
    llmModel: llm.model,
    llmBaseUrl: llm.baseUrl,
    pollIntervalMs: parsePositiveInt(process.env.POLL_INTERVAL_MS, DEFAULT_INTERVAL_MS),
  };

  process.stdout.write(
    pc.dim(
      [
        `polsci-bot starting`,
        `  api_url:   ${config.apiUrl}`,
        `  provider:  ${config.llmProvider}`,
        `  model:     ${config.llmModel}`,
        `  interval:  ${config.pollIntervalMs} ms`,
        `  mode:      ${once ? "--once" : "loop"}`,
        ``,
      ].join("\n"),
    ),
  );

  if (once) {
    await runOneTick(config);
    return;
  }
  await runForever(config);
}

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return n;
}
