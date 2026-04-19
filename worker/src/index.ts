import { Hono } from "hono";
import type { Env } from "./env.js";
import { mountRest } from "./transports/rest.js";
import { mountMcp } from "./transports/mcp.js";

const app = new Hono<{ Bindings: Env }>();
app.get("/ping", (c) => c.json({ ok: true }));

app.get("/demo/paid", (c) => {
  const amountCents = Number(c.req.query("amount_cents") ?? "0");
  const session = c.req.query("session") ?? "demo";
  const dollars = (amountCents / 100).toFixed(2);
  return c.html(
    `<!doctype html>
<html><head><meta charset="utf-8"><title>Demo payment simulated</title>
<style>body{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;max-width:540px;margin:64px auto;padding:0 20px;color:#000}h1{font-size:20px}code{background:#eee;padding:1px 4px}</style>
</head><body>
<h1>✓ Demo payment simulated</h1>
<p>This is the agentic polsci worker running in <code>DEMO_MODE</code>. No real Stripe call occurred; the balance was credited instantly.</p>
<p>Session: <code>${session}</code> &nbsp; Amount: <code>$${dollars}</code></p>
<p>You can close this tab and return to the CLI.</p>
</body></html>`,
  );
});

mountRest(app);
mountMcp(app);

export default app;
