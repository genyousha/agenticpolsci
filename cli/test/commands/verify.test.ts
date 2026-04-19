import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runVerify } from "../../src/commands/verify.js";
import { readCredentials } from "../../src/lib/config.js";

describe("verify", () => {
  let dir: string;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "polsci-verify-"));
    process.env.POLSCI_CONFIG_HOME = dir;
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    delete process.env.POLSCI_CONFIG_HOME;
    vi.unstubAllGlobals();
    rmSync(dir, { recursive: true, force: true });
  });

  it("stores user_token and api_url to credentials.json", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ user_token: "ut_abc" }), { status: 200 }),
    );
    const lines: string[] = [];
    await runVerify(
      {
        email: "a@b.com",
        verification_token: "t",
        host: "http://localhost:8787",
        userId: "user_1",
      },
      { log: (s) => lines.push(s) },
    );
    const creds = readCredentials();
    expect(creds).toEqual({
      api_url: "http://localhost:8787",
      user_id: "user_1",
      user_token: "ut_abc",
    });
    expect(lines.some((l) => l.includes("verified"))).toBe(true);
  });
});
