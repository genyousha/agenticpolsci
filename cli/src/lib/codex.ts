import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

/** Path Codex CLI reads for its config (MCP servers live inside). */
export function codexConfigPath(): string {
  if (process.env.POLSCI_CODEX_CONFIG) return process.env.POLSCI_CODEX_CONFIG;
  return join(homedir(), ".codex", "config.toml");
}

function slugifyName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

/** Match a [mcp_servers.NAME] TOML header. Captures NAME. */
const MCP_HEADER_RE = /^\s*\[\s*mcp_servers\.([A-Za-z0-9_\-]+)\s*\]\s*$/m;

function existingMcpKeys(toml: string): Set<string> {
  const keys = new Set<string>();
  const re = /^\s*\[\s*mcp_servers\.([A-Za-z0-9_\-]+)\s*\]/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(toml)) !== null) keys.add(m[1]!);
  return keys;
}

function pickUniqueKey(existing: Set<string>, base: string, agentId: string): string {
  if (!existing.has(base)) return base;
  const suffixed = `${base}-${agentId.replace(/^agent-/, "").slice(0, 6)}`;
  return existing.has(suffixed) ? `${suffixed}-${Date.now().toString(36)}` : suffixed;
}

/**
 * Serialize an mcp_servers entry as a TOML block. Intentionally narrow
 * to the shape we emit — no need to pull in a TOML library.
 */
function renderBlock(key: string, url: string, agentToken: string): string {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return [
    `[mcp_servers.${key}]`,
    `type = "http"`,
    `url = "${esc(url)}"`,
    ``,
    `[mcp_servers.${key}.headers]`,
    `Authorization = "Bearer ${esc(agentToken)}"`,
    ``,
  ].join("\n");
}

export interface InstallCodexOpts {
  apiUrl: string;
  agentToken: string;
  agentId: string;
  displayName: string;
}

export interface InstallCodexResult {
  key: string;
  configPath: string;
  backupPath: string;
}

/**
 * Append a new [mcp_servers.<key>] block to Codex's config.toml.
 * Creates the file (and parent dir) if missing. Always writes a
 * timestamped backup first when modifying an existing file.
 *
 * We append rather than parse+re-serialize so we don't need a TOML
 * library and don't risk reformatting the user's existing config.
 */
export function installCodexMcpEntry(opts: InstallCodexOpts): InstallCodexResult {
  const p = codexConfigPath();
  const url = `${opts.apiUrl.replace(/\/+$/, "")}/mcp`;
  let existing: Set<string>;
  let backupPath = "";
  let current = "";
  if (existsSync(p)) {
    current = readFileSync(p, "utf-8");
    backupPath = `${p}.bak.${Date.now()}`;
    writeFileSync(backupPath, current);
    existing = existingMcpKeys(current);
  } else {
    existing = new Set();
    mkdirSync(dirname(p), { recursive: true });
  }
  const base = `agentic-polsci-${slugifyName(opts.displayName) || "agent"}`;
  const key = pickUniqueKey(existing, base, opts.agentId);
  const block = renderBlock(key, url, opts.agentToken);
  const sep = current.length === 0 || current.endsWith("\n") ? "\n" : "\n\n";
  writeFileSync(p, current + sep + block);
  return { key, configPath: p, backupPath };
}
