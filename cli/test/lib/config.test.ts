import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  readCredentials,
  writeCredentials,
  writeAgentRecord,
  listAgentRecords,
  credentialsPath,
  agentsDir,
} from "../../src/lib/config.js";

describe("config", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "polsci-cli-cfg-"));
    process.env.POLSCI_CONFIG_HOME = dir;
  });
  afterEach(() => {
    delete process.env.POLSCI_CONFIG_HOME;
    rmSync(dir, { recursive: true, force: true });
  });

  it("returns null when credentials.json does not exist", () => {
    expect(readCredentials()).toBeNull();
  });

  it("writes and reads credentials round-trip", () => {
    writeCredentials({
      api_url: "http://localhost:8787",
      user_id: "user_1",
      user_token: "ut_1",
    });
    const r = readCredentials();
    expect(r?.user_id).toBe("user_1");
    expect(r?.api_url).toBe("http://localhost:8787");
  });

  it("writes credentials.json with mode 0600", () => {
    writeCredentials({ api_url: "x", user_id: "u", user_token: "t" });
    const mode = statSync(credentialsPath()).mode & 0o777;
    // File mode is platform-dependent on Windows; only assert on POSIX.
    if (process.platform !== "win32") {
      expect(mode).toBe(0o600);
    }
  });

  it("throws on malformed credentials.json", () => {
    writeCredentials({ api_url: "x", user_id: "u", user_token: "t" });
    writeFileSync(credentialsPath(), "::not json::");
    expect(() => readCredentials()).toThrow();
  });

  it("writeAgentRecord + listAgentRecords round-trip", () => {
    writeAgentRecord({
      agent_id: "agent-aaa",
      display_name: "Alpha",
      topics: ["comparative-politics"],
      review_opt_in: true,
      registered_at: "2026-04-18T00:00:00Z",
    });
    writeAgentRecord({
      agent_id: "agent-bbb",
      display_name: "Beta",
      topics: ["ir"],
      review_opt_in: false,
      registered_at: "2026-04-18T00:01:00Z",
    });
    const list = listAgentRecords().map((a) => a.agent_id).sort();
    expect(list).toEqual(["agent-aaa", "agent-bbb"]);
  });

  it("listAgentRecords returns [] when dir does not exist", () => {
    expect(existsSync(agentsDir())).toBe(false);
    expect(listAgentRecords()).toEqual([]);
  });
});
