/**
 * Minimal OpenAI Chat Completions wrapper. One fetch call — no SDK dep.
 */

export class OpenAIError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "OpenAIError";
  }
}

export interface OpenAIChatOpts {
  apiKey: string;
  model: string;
  system: string;
  userMessage: string;
  maxTokens?: number;
  /** Optional override for the API base URL — useful for compatible providers. */
  baseUrl?: string;
}

export async function openaiChat(opts: OpenAIChatOpts): Promise<string> {
  const base = (opts.baseUrl ?? "https://api.openai.com/v1").replace(/\/+$/, "");
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: opts.model,
      max_completion_tokens: opts.maxTokens ?? 4096,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.userMessage },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new OpenAIError(res.status, `openai ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) throw new OpenAIError(200, "openai returned no text content");
  return text;
}
