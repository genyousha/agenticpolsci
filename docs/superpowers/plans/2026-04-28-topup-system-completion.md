# Topup System Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the two known gaps in the prepaid-balance topup pipeline so (a) the post-payment redirect lands on a real page instead of a 404, and (b) `users.stripe_customer_id` is populated on first topup so repeat topups attach to a single Stripe customer.

**Architecture:** Worker-only changes in `worker/`. Two new HTML routes mirror the existing `/demo/paid` pattern. The Stripe Checkout call gains a `customer_creation: "always"` flag so the webhook receives a real `customer` id; the webhook writes that id back to the user row via a guarded `WHERE stripe_customer_id IS NULL` UPDATE inside the existing atomic `DB.batch`. No CLI, site, or MCP-surface changes.

**Tech Stack:** Cloudflare Workers (Hono), TypeScript, vitest with `@cloudflare/vitest-pool-workers` (`SELF.fetch` for integrated route tests; `cloudflare:test` `env` for handler-level tests), D1.

**Spec:** `docs/superpowers/specs/2026-04-28-topup-system-completion-design.md`

---

## File Structure

| Path | Role |
|---|---|
| `worker/src/index.ts` | Mount points for `/ping`, `/demo/paid`, REST + MCP. We add `GET /topup/success` and `GET /topup/cancel` here, next to `/demo/paid`. |
| `worker/src/handlers/topup_balance.ts` | Builds the Stripe Checkout call. We append `?session_id={CHECKOUT_SESSION_ID}` to `successUrl`. |
| `worker/src/lib/stripe.ts` | `createCheckoutSession` (form builder for the Stripe REST call) gains conditional `customer_creation: "always"`. `parseCheckoutSessionCompleted` (event-shape parser) starts extracting `customer`. |
| `worker/src/handlers/stripe_webhook.ts` | Adds a third statement to the existing `DB.batch` to write back `stripe_customer_id`. |
| `worker/test/handlers/topup_pages.test.ts` (new) | SELF.fetch tests for the two new HTML routes. |
| `worker/test/handlers/topup_balance.test.ts` | +2 cases: success URL has session_id placeholder; form body has `customer_creation` only when `customerId` absent. |
| `worker/test/handlers/stripe_webhook.test.ts` | +2 cases: writes back `stripe_customer_id` when NULL; does not overwrite when set. |
| `worker/test/helpers/stripe-mock.ts` | `makeCheckoutCompletedEvent` gains optional `customer?: string`. |

---

## Task 1: Add `/topup/cancel` HTML route

**Files:**
- Modify: `worker/src/index.ts`
- Test: `worker/test/handlers/topup_pages.test.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `worker/test/handlers/topup_pages.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd worker && npx vitest run test/handlers/topup_pages.test.ts`
Expected: FAIL — `/topup/cancel` returns 404.

- [ ] **Step 3: Implement the cancel route**

In `worker/src/index.ts`, add a new `app.get("/topup/cancel", …)` block immediately after the existing `/demo/paid` handler (before `mountRest(app);`):

```ts
app.get("/topup/cancel", (c) => {
  return c.html(
    `<!doctype html>
<html><head><meta charset="utf-8"><title>Payment cancelled</title>
<style>body{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;max-width:540px;margin:64px auto;padding:0 20px;color:#000}h1{font-size:20px}code{background:#eee;padding:1px 4px}</style>
</head><body>
<h1>Payment cancelled</h1>
<p>No charge was made. Run <code>polsci topup --amount &lt;usd&gt;</code> to retry.</p>
</body></html>`,
  );
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd worker && npx vitest run test/handlers/topup_pages.test.ts`
Expected: PASS — 1 test.

- [ ] **Step 5: Commit**

```bash
git add worker/src/index.ts worker/test/handlers/topup_pages.test.ts
git commit -m "feat(worker): mount /topup/cancel HTML page"
```

---

## Task 2: Add `/topup/success` HTML route

**Files:**
- Modify: `worker/src/index.ts`
- Modify: `worker/test/handlers/topup_pages.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `worker/test/handlers/topup_pages.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd worker && npx vitest run test/handlers/topup_pages.test.ts`
Expected: 2 new tests FAIL — `/topup/success` returns 404.

- [ ] **Step 3: Implement the success route**

In `worker/src/index.ts`, add immediately after the `/topup/cancel` handler:

```ts
app.get("/topup/success", (c) => {
  const sessionRaw = c.req.query("session_id") ?? "";
  // Only display if it looks like a Stripe session id (cs_ prefix). Avoids
  // reflecting arbitrary strings into the page (defense-in-depth — Hono
  // already escapes via c.html, but extra belt + suspenders here).
  const session = /^cs_[A-Za-z0-9_]+$/.test(sessionRaw) ? sessionRaw : "";
  const sessionLine = session
    ? `<p>Session: <code>${session}</code></p>`
    : "";
  return c.html(
    `<!doctype html>
<html><head><meta charset="utf-8"><title>Payment received</title>
<style>body{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;max-width:540px;margin:64px auto;padding:0 20px;color:#000}h1{font-size:20px}code{background:#eee;padding:1px 4px}</style>
</head><body>
<h1>Payment received</h1>
<p>Your prepaid balance will be credited within a few seconds. Run <code>polsci balance</code> in your terminal to confirm.</p>
${sessionLine}
<p>You can close this tab.</p>
</body></html>`,
  );
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd worker && npx vitest run test/handlers/topup_pages.test.ts`
Expected: PASS — all 3 tests in the file.

- [ ] **Step 5: Commit**

```bash
git add worker/src/index.ts worker/test/handlers/topup_pages.test.ts
git commit -m "feat(worker): mount /topup/success HTML page with session_id reflection"
```

---

## Task 3: Template `{CHECKOUT_SESSION_ID}` into the success URL

**Files:**
- Modify: `worker/src/handlers/topup_balance.ts:42`
- Modify: `worker/test/handlers/topup_balance.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `worker/test/handlers/topup_balance.test.ts` (inside the `describe("topup_balance", …)` block):

```ts
  it("hands Stripe a successUrl containing {CHECKOUT_SESSION_ID} placeholder", async () => {
    const { user_id } = await seedUser({});
    let capturedBody = "";
    vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      capturedBody = (init?.body as string) ?? "";
      return new Response(
        JSON.stringify({ id: "cs_test_xyz", url: "https://stripe.example/cs/xyz" }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    const res = await topupBalance(env, { kind: "user", user_id }, { amount_cents: 500 });
    expect(res.ok).toBe(true);
    // URLSearchParams percent-encodes braces. Look for the encoded placeholder.
    expect(capturedBody).toContain("success_url=");
    expect(decodeURIComponent(capturedBody)).toContain("/topup/success?session_id={CHECKOUT_SESSION_ID}");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd worker && npx vitest run test/handlers/topup_balance.test.ts`
Expected: FAIL — current code passes a successUrl without `?session_id={CHECKOUT_SESSION_ID}`.

- [ ] **Step 3: Modify the handler**

In `worker/src/handlers/topup_balance.ts`, change line 42 from:

```ts
      successUrl: `${env.PUBLIC_URL}/topup/success`,
```

to:

```ts
      successUrl: `${env.PUBLIC_URL}/topup/success?session_id={CHECKOUT_SESSION_ID}`,
```

(Stripe substitutes `{CHECKOUT_SESSION_ID}` server-side before redirecting the browser. No change needed in `lib/stripe.ts` — `URLSearchParams` will URL-encode the braces, which Stripe accepts.)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd worker && npx vitest run test/handlers/topup_balance.test.ts`
Expected: PASS — all topup_balance tests including the new one.

- [ ] **Step 5: Commit**

```bash
git add worker/src/handlers/topup_balance.ts worker/test/handlers/topup_balance.test.ts
git commit -m "feat(worker): pass {CHECKOUT_SESSION_ID} placeholder into Stripe success_url"
```

---

## Task 4: Force `customer_creation: "always"` when no existing customer

**Files:**
- Modify: `worker/src/lib/stripe.ts:18-44` (the `createCheckoutSession` body)
- Modify: `worker/test/handlers/topup_balance.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `worker/test/handlers/topup_balance.test.ts`:

```ts
  it("requests customer_creation=always when the user has no stripe_customer_id", async () => {
    const { user_id } = await seedUser({});
    let capturedBody = "";
    vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      capturedBody = (init?.body as string) ?? "";
      return new Response(
        JSON.stringify({ id: "cs_test_xyz", url: "https://stripe.example/cs/xyz" }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    const res = await topupBalance(env, { kind: "user", user_id }, { amount_cents: 500 });
    expect(res.ok).toBe(true);
    expect(capturedBody).toContain("customer_creation=always");
    expect(capturedBody).not.toContain("customer=cus_");
  });

  it("omits customer_creation and reuses the customer id on a repeat topup", async () => {
    const { user_id } = await seedUser({});
    await env.DB.prepare("UPDATE users SET stripe_customer_id = ? WHERE user_id = ?")
      .bind("cus_existing_123", user_id)
      .run();
    let capturedBody = "";
    vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      capturedBody = (init?.body as string) ?? "";
      return new Response(
        JSON.stringify({ id: "cs_test_xyz", url: "https://stripe.example/cs/xyz" }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    const res = await topupBalance(env, { kind: "user", user_id }, { amount_cents: 500 });
    expect(res.ok).toBe(true);
    expect(capturedBody).not.toContain("customer_creation=");
    expect(capturedBody).toContain("customer=cus_existing_123");
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd worker && npx vitest run test/handlers/topup_balance.test.ts`
Expected: FAIL — first new test fails (no `customer_creation` in body); second passes only the customer-set branch which already works.

- [ ] **Step 3: Modify `createCheckoutSession`**

In `worker/src/lib/stripe.ts`, replace the existing `if (opts.customerId) form.set("customer", opts.customerId);` line with a branched block:

```ts
  if (opts.customerId) {
    form.set("customer", opts.customerId);
  } else {
    // No existing Stripe customer for this user — force Stripe to create one
    // so the webhook receives a non-null `customer` id and we can write it
    // back to users.stripe_customer_id. Default in mode:payment is
    // "if_required", which yields no customer for plain card payments.
    form.set("customer_creation", "always");
  }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd worker && npx vitest run test/handlers/topup_balance.test.ts`
Expected: PASS — all topup_balance tests.

- [ ] **Step 5: Commit**

```bash
git add worker/src/lib/stripe.ts worker/test/handlers/topup_balance.test.ts
git commit -m "feat(worker): force Stripe to create a customer on first topup

So the checkout.session.completed event carries a customer id we can
write back to users.stripe_customer_id. Default mode:payment behavior
('if_required') skips customer creation for ordinary card payments."
```

---

## Task 5: Extract `customer` from the Stripe event

**Files:**
- Modify: `worker/src/lib/stripe.ts:5-9` (type) and `:65-87` (parser)
- Modify: `worker/test/helpers/stripe-mock.ts`

- [ ] **Step 1: Augment the test helper**

In `worker/test/helpers/stripe-mock.ts`, change the function signature and body to add an optional `customer` field:

```ts
export function makeCheckoutCompletedEvent(opts: {
  event_id: string;
  user_id: string;
  amount_cents: number;
  customer?: string;
}): string {
  const event = {
    id: opts.event_id,
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_test_${opts.event_id}`,
        amount_total: opts.amount_cents,
        currency: "usd",
        payment_status: "paid",
        customer: opts.customer ?? null,
        metadata: { user_id: opts.user_id },
      },
    },
  };
  return JSON.stringify(event);
}
```

- [ ] **Step 2: Run existing webhook tests to confirm no regression**

Run: `cd worker && npx vitest run test/handlers/stripe_webhook.test.ts`
Expected: PASS — 3 existing tests still green.

- [ ] **Step 3: Update the type and parser**

In `worker/src/lib/stripe.ts`, change the `CheckoutSessionCompleted` type to add `customer_id`:

```ts
export type CheckoutSessionCompleted = {
  event_id: string;
  user_id: string;
  amount_cents: number;
  customer_id: string | null;
};
```

Then update `parseCheckoutSessionCompleted` to extract the `customer` field. Replace the function body (lines ~65-87) with:

```ts
export function parseCheckoutSessionCompleted(body: string): CheckoutSessionCompleted | null {
  const event = JSON.parse(body) as {
    id: string;
    type: string;
    data: {
      object: {
        amount_total?: number;
        payment_status?: string;
        customer?: string | null;
        metadata?: { user_id?: string };
      };
    };
  };
  if (event.type !== "checkout.session.completed") return null;
  const obj = event.data.object;
  if (obj.payment_status !== "paid") return null;
  if (typeof obj.amount_total !== "number") return null;
  if (!obj.metadata?.user_id) return null;
  return {
    event_id: event.id,
    user_id: obj.metadata.user_id,
    amount_cents: obj.amount_total,
    customer_id: typeof obj.customer === "string" ? obj.customer : null,
  };
}
```

- [ ] **Step 4: Verify the worker still compiles and existing tests still pass**

Run: `cd worker && npm run typecheck && npx vitest run test/handlers/stripe_webhook.test.ts test/lib/stripe.test.ts`
Expected: typecheck clean; webhook + stripe lib tests still green. (The `stripe_webhook.ts` consumer is type-compatible — it only reads `evt.event_id`, `evt.user_id`, `evt.amount_cents` today; adding a new field is non-breaking.)

- [ ] **Step 5: Commit**

```bash
git add worker/src/lib/stripe.ts worker/test/helpers/stripe-mock.ts
git commit -m "refactor(worker): parse customer id from checkout.session.completed"
```

---

## Task 6: Write `stripe_customer_id` back on first topup

**Files:**
- Modify: `worker/src/handlers/stripe_webhook.ts:18-26`
- Modify: `worker/test/handlers/stripe_webhook.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `worker/test/handlers/stripe_webhook.test.ts`:

```ts
  it("writes back stripe_customer_id when the user's column is NULL", async () => {
    const { user_id } = await seedUser({});
    const body = makeCheckoutCompletedEvent({
      event_id: "evt_wh_cust_1",
      user_id,
      amount_cents: 500,
      customer: "cus_test_first",
    });
    const sig = await stripeSignatureHeader(body, env.STRIPE_WEBHOOK_SECRET);
    const res = await handleStripeWebhook(env, body, sig);
    expect(res.ok).toBe(true);

    const row = await env.DB
      .prepare("SELECT stripe_customer_id FROM users WHERE user_id = ?")
      .bind(user_id)
      .first<{ stripe_customer_id: string | null }>();
    expect(row?.stripe_customer_id).toBe("cus_test_first");
  });

  it("does NOT overwrite an existing stripe_customer_id", async () => {
    const { user_id } = await seedUser({});
    await env.DB.prepare("UPDATE users SET stripe_customer_id = ? WHERE user_id = ?")
      .bind("cus_already_set", user_id)
      .run();
    const body = makeCheckoutCompletedEvent({
      event_id: "evt_wh_cust_2",
      user_id,
      amount_cents: 500,
      customer: "cus_should_be_ignored",
    });
    const sig = await stripeSignatureHeader(body, env.STRIPE_WEBHOOK_SECRET);
    const res = await handleStripeWebhook(env, body, sig);
    expect(res.ok).toBe(true);

    const row = await env.DB
      .prepare("SELECT stripe_customer_id FROM users WHERE user_id = ?")
      .bind(user_id)
      .first<{ stripe_customer_id: string | null }>();
    expect(row?.stripe_customer_id).toBe("cus_already_set");
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd worker && npx vitest run test/handlers/stripe_webhook.test.ts`
Expected: 2 new tests FAIL — first asserts `cus_test_first` but the column is still NULL; second passes only because the column already has the value (the seed set it). Fix in step 3.

- [ ] **Step 3: Extend the webhook batch with a guarded UPDATE**

In `worker/src/handlers/stripe_webhook.ts`, replace the `try { … } catch …` block (lines 17-34) with:

```ts
  const now = Math.floor(Date.now() / 1000);
  try {
    const stmts = [
      env.DB.prepare(
        "INSERT INTO payment_events (stripe_event_id,user_id,amount_cents,type,created_at) VALUES (?,?,?,?,?)",
      ).bind(evt.event_id, evt.user_id, evt.amount_cents, "topup", now),
      env.DB.prepare(
        "UPDATE balances SET balance_cents = balance_cents + ?, updated_at = ? WHERE user_id = ?",
      ).bind(evt.amount_cents, now, evt.user_id),
    ];
    if (evt.customer_id) {
      // Only set on first topup. Guard prevents overwrite if the column is
      // already populated (from an earlier event or manual operator fix).
      stmts.push(
        env.DB.prepare(
          "UPDATE users SET stripe_customer_id = ? WHERE user_id = ? AND stripe_customer_id IS NULL",
        ).bind(evt.customer_id, evt.user_id),
      );
    }
    await env.DB.batch(stmts);
  } catch (e) {
    const msg = (e as Error).message;
    // UNIQUE violation on stripe_event_id → replay, no-op.
    if (/UNIQUE/.test(msg) || /already exists/i.test(msg)) {
      return ok({ received: true });
    }
    return err("internal", msg);
  }
  return ok({ received: true });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd worker && npx vitest run test/handlers/stripe_webhook.test.ts`
Expected: PASS — all 5 tests in the file.

- [ ] **Step 5: Run the full worker test suite to catch any regression**

Run: `cd worker && npm test`
Expected: PASS — full worker test suite including new and existing tests. Note the pre-existing tally was 55 worker tests; this plan adds 7 new (3 page tests + 3 topup_balance + 2 webhook = 8, minus the 1 that replaces existing-state-asserting line in get_balance? — actually all are net-new, so 55 + 8 = 63 expected, give or take). Watch for any unrelated failures and stop if so.

- [ ] **Step 6: Commit**

```bash
git add worker/src/handlers/stripe_webhook.ts worker/test/handlers/stripe_webhook.test.ts
git commit -m "feat(worker): write stripe_customer_id back to users on first topup

Closes Plan 1.2 backlog item #1. Combined with the customer_creation
flag in createCheckoutSession, repeat topups now attach to a single
Stripe customer instead of spawning a new one per payment. Guarded
UPDATE prevents overwrite if the column is already populated."
```

---

## Self-Review

**Spec coverage:**

- Spec §3.1 (mount `/topup/success` and `/topup/cancel`) → Tasks 1 + 2.
- Spec §3.2 (template `{CHECKOUT_SESSION_ID}` into successUrl) → Task 3.
- Spec §3.3 (a) `customer_creation: "always"` → Task 4.
- Spec §3.3 (b) parser extracts `customer` → Task 5.
- Spec §3.3 webhook write-back with NULL guard → Task 6.
- Spec §3.4 tests for pages, customer_creation form body, parser helper, webhook write-back (both branches) → all present in Tasks 1-6.

**Placeholder scan:** none. Every code step shows the exact code; every command shows the exact `cd worker && npx vitest run …` invocation and the expected outcome.

**Type consistency:** the new `customer_id: string | null` field on `CheckoutSessionCompleted` (Task 5) is the same name read by `stripe_webhook.ts` (Task 6 uses `evt.customer_id`). The test helper field is named `customer` (Task 5) matching the on-the-wire Stripe event shape, with the parser mapping `obj.customer` → `customer_id` on the parsed type. Consistent across tasks.

**Notes for the executor:**

- All commands run from the repository root unless prefixed with `cd worker`.
- `SELF.fetch("http://worker/...")` is the in-process route test pattern from `@cloudflare/vitest-pool-workers`; the host portion is ignored.
- The `vi.spyOn(globalThis, "fetch")` mock is shared with the existing topup_balance test — `vi.restoreAllMocks()` already runs in `beforeEach`, so per-test mocks are isolated.
- After Task 6, run `cd worker && npm run typecheck` once more before opening the PR.
