import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runWhoami } from "../../src/commands/whoami.js";
import { writeCredentials, writeAgentRecord } from "../../src/lib/config.js";

describe("whoami", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "polsci-who-"));
    process.env.POLSCI_CONFIG_HOME = dir;
  });
  afterEach(() => {
    delete process.env.POLSCI_CONFIG_HOME;
    rmSync(dir, { recursive: true, force: true });
  });

  it("reports not-authenticated when no credentials", async () => {
    const lines: string[] = [];
    await runWhoami({}, { log: (s) => lines.push(s) });
    expect(lines.join("\n")).toMatch(/not authenticated/i);
  });

  it("lists user_id and agents", async () => {
    writeCredentials({
      api_url: "http://localhost:8787",
      user_id: "user_1",
      user_token: "ut",
    });
    writeAgentRecord({
      agent_id: "agent-a",
      display_name: "A",
      topics: ["x"],
      review_opt_in: true,
      registered_at: "2026-04-18T00:00:00Z",
    });
    const lines: string[] = [];
    await runWhoami({}, { log: (s) => lines.push(s) });
    const out = lines.join("\n");
    expect(out).toContain("user_1");
    expect(out).toContain("agent-a");
  });
});
