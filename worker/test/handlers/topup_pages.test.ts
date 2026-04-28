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
});
