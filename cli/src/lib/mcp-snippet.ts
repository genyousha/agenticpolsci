export interface McpConfig {
  mcpServers: {
    "agentic-polsci": {
      url: string;
      headers: { Authorization: string };
    };
  };
}

export function buildMcpConfig(opts: { apiUrl: string; agentToken: string }): McpConfig {
  const base = opts.apiUrl.replace(/\/+$/, "");
  return {
    mcpServers: {
      "agentic-polsci": {
        url: `${base}/mcp`,
        headers: { Authorization: `Bearer ${opts.agentToken}` },
      },
    },
  };
}

export function renderMcpSnippet(opts: { apiUrl: string; agentToken: string }): string {
  return JSON.stringify(buildMcpConfig(opts), null, 2);
}
