import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { installCodexMcpEntry, codexConfigPath } from "../../src/lib/codex.js";

describe("codex.installCodexMcpEntry", () => {
  let dir: string;
  let configFile: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "polsci-codex-"));
    configFile = join(dir, "codex", "config.toml");
    process.env.POLSCI_CODEX_CONFIG = configFile;
  });
  afterEach(() => {
    delete process.env.POLSCI_CODEX_CONFIG;
    rmSync(dir, { recursive: true, force: true });
  });

  it("creates the parent dir and config file if missing, writes a valid block", () => {
    const r = installCodexMcpEntry({
      apiUrl: "https://worker.example.com",
      agentToken: "tok_1",
      agentId: "agent-abc",
      displayName: "SylviaW",
    });
    expect(existsSync(configFile)).toBe(true);
    expect(r.configPath).toBe(configFile);
    expect(r.key).toBe("agentic-polsci-sylviaw");
    expect(r.backupPath).toBe("");
    const out = readFileSync(configFile, "utf-8");
    expect(out).toContain("[mcp_servers.agentic-polsci-sylviaw]");
    expect(out).toContain('type = "http"');
    expect(out).toContain('url = "https://worker.example.com/mcp"');
    expect(out).toContain("[mcp_servers.agentic-polsci-sylviaw.headers]");
    expect(out).toContain('Authorization = "Bearer tok_1"');
  });

  it("appends to an existing file, preserving prior content and backing up", () => {
    mkdirSync(dirname(configFile), { recursive: true });
    const prior = `# user's existing notes\n[model]\nname = "gpt-4o"\n`;
    writeFileSync(configFile, prior);
    const r = installCodexMcpEntry({
      apiUrl: "https://worker.example.com",
      agentToken: "tok_2",
      agentId: "agent-def",
      displayName: "NextBot",
    });
    expect(r.backupPath).toContain(".bak.");
    expect(existsSync(r.backupPath)).toBe(true);
    const out = readFileSync(configFile, "utf-8");
    expect(out.startsWith(prior)).toBe(true);
    expect(out).toContain("[mcp_servers.agentic-polsci-nextbot]");
    expect(out).toContain('Authorization = "Bearer tok_2"');
  });

  it("picks a unique key by suffixing agent_id prefix when display_name collides", () => {
    mkdirSync(dirname(configFile), { recursive: true });
    writeFileSync(
      configFile,
      `[mcp_servers.agentic-polsci-sylviaw]\ntype = "http"\nurl = "https://old"\n\n[mcp_servers.agentic-polsci-sylviaw.headers]\nAuthorization = "Bearer old"\n`,
    );
    const r = installCodexMcpEntry({
      apiUrl: "https://worker.example.com",
      agentToken: "tok_new",
      agentId: "agent-xyz123",
      displayName: "SylviaW",
    });
    expect(r.key).toBe("agentic-polsci-sylviaw-xyz123");
    const out = readFileSync(configFile, "utf-8");
    // Old entry untouched.
    expect(out).toContain('Authorization = "Bearer old"');
    // New one appended.
    expect(out).toContain("[mcp_servers.agentic-polsci-sylviaw-xyz123]");
    expect(out).toContain('Authorization = "Bearer tok_new"');
  });

  it("codexConfigPath respects POLSCI_CODEX_CONFIG override", () => {
    expect(codexConfigPath()).toBe(configFile);
  });
});
