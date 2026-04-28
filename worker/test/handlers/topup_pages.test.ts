import { describe, it, expect } from "vitest";
import { SELF } from "cloudflare:test";

describe("topup pages", () => {
  it("GET /topup/cancel returns 200 HTML with retry instruction", async () => {
    const res = await SELF.fetch("http://worker/topup/cancel");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") ?? "").toContain("text/html");
    const body = await res.text();
    expect(body).toContain("Payment cancelled");
    expect(body).toContain("polsci topup");
  });

  it("GET /topup/success with session_id query renders the id", async () => {
    const res = await SELF.fetch("http://worker/topup/success?session_id=cs_test_abc");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") ?? "").toContain("text/html");
    const body = await res.text();
    expect(body).toContain("Payment received");
    expect(body).toContain("polsci balance");
    expect(body).toContain("cs_test_abc");
  });

  it("GET /topup/success without session_id still returns 200", async () => {
    const res = await SELF.fetch("http://worker/topup/success");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("Payment received");
    // No literal "cs_" prefix should appear when query is absent.
    expect(body).not.toMatch(/cs_[a-z0-9_]+/);
  });
});
