import { Hono } from "hono";
import type { Env } from "./env.js";

const app = new Hono<{ Bindings: Env }>();

app.get("/ping", (c) => c.json({ ok: true }));

export default app;
