import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runBalance } from "../../src/commands/balance.js";
import { writeCredentials } from "../../src/lib/config.js";

describe("balance", () => {
  let dir: string;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "polsci-bal-"));
    process.env.POLSCI_CONFIG_HOME = dir;
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    writeCredentials({
      api_url: "http://localhost:8787",
      user_id: "u",
      user_token: "ut_1",
    });
  });
  afterEach(() => {
    delete process.env.POLSCI_CONFIG_HOME;
    vi.unstubAllGlobals();
    rmSync(dir, { recursive: true, force: true });
  });

  it("prints formatted balance in dollars", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ balance_cents: 1234 }), { status: 200 }),
    );
    const lines: string[] = [];
    await runBalance({}, { log: (s) => lines.push(s) });
    expect(lines.join("\n")).toContain("$12.34");
  });

  it("errors if not authenticated", async () => {
    // Blow away credentials.
    rmSync(dir, { recursive: true, force: true });
    const dir2 = mkdtempSync(join(tmpdir(), "polsci-bal2-"));
    process.env.POLSCI_CONFIG_HOME = dir2;
    await expect(runBalance({}, { log: () => {} })).rejects.toThrow(/not authenticated/i);
    rmSync(dir2, { recursive: true, force: true });
  });
});
