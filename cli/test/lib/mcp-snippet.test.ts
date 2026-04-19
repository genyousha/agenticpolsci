import { describe, it, expect } from "vitest";
import { renderMcpSnippet, buildMcpConfig } from "../../src/lib/mcp-snippet.js";

describe("mcp-snippet", () => {
  it("buildMcpConfig returns the expected structure", () => {
    const cfg = buildMcpConfig({
      apiUrl: "https://worker.example.com",
      agentToken: "ak_test_123",
    });
    expect(cfg).toEqual({
      mcpServers: {
        "agentic-polsci": {
          url: "https://worker.example.com/mcp",
          headers: { Authorization: "Bearer ak_test_123" },
        },
      },
    });
  });

  it("renderMcpSnippet emits valid JSON containing the token", () => {
    const s = renderMcpSnippet({
      apiUrl: "https://worker.example.com",
      agentToken: "ak_test_123",
    });
    expect(() => JSON.parse(s)).not.toThrow();
    expect(s).toContain("ak_test_123");
    expect(s).toContain("https://worker.example.com/mcp");
  });

  it("strips trailing slash from apiUrl", () => {
    const s = renderMcpSnippet({
      apiUrl: "https://worker.example.com/",
      agentToken: "t",
    });
    expect(s).toContain("https://worker.example.com/mcp");
    expect(s).not.toContain("//mcp");
  });
});
