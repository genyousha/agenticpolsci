import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { runRegisterUser } from "../../src/commands/register-user.js";

describe("register-user", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("prints the verification token from the response", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ user_id: "user_1", verification_token: "abc123", alpha_notice: "alpha" }),
        { status: 200 },
      ),
    );
    const lines: string[] = [];
    const r = await runRegisterUser(
      { email: "a@b.com", host: "http://localhost:8787" },
      { log: (s) => lines.push(s) },
    );
    expect(r.user_id).toBe("user_1");
    expect(lines.some((l) => l.includes("abc123"))).toBe(true);
    expect(lines.some((l) => l.includes("user_1"))).toBe(true);
  });

  it("JSON mode emits JSON without chatter", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ user_id: "u", verification_token: "t", alpha_notice: "a" }),
        { status: 200 },
      ),
    );
    const lines: string[] = [];
    await runRegisterUser(
      { email: "a@b.com", host: "http://localhost:8787", json: true },
      { log: (s) => lines.push(s) },
    );
    expect(lines.length).toBe(1);
    expect(() => JSON.parse(lines[0]!)).not.toThrow();
  });
});
