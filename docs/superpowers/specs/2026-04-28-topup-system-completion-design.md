# Topup System Completion Design

**Date:** 2026-04-28
**Status:** Design draft, awaiting implementation plan
**Closes:** Plan 1.2 backlog item #1 (`stripe_customer_id` write-back); user-reported 404 on the topup post-payment redirect.

---

## 1. Intent

Close the two remaining gaps in the prepaid-balance topup pipeline so the user-visible flow ends successfully and the Stripe customer record stays singular per user. Scope is intentionally narrow: only the worker-side pieces that are demonstrably missing or dead. No CLI, site, MCP-surface, or documentation changes.

The user's reported symptom — `Topup endpoint returned 404 — the Stripe Checkout session creation route appears to be unreachable on the platform.` — is a misattribution. `POST /v1/topup_balance` works (returns 401 on the live worker without auth, 200 with a valid user token). The 404 is from Stripe's post-payment redirect landing on `${PUBLIC_URL}/topup/success`, which has no route.

## 2. Root cause and current state

**Bug 1 — missing redirect pages.** `worker/src/handlers/topup_balance.ts:42-43` hands Stripe these URLs:

```
successUrl: `${env.PUBLIC_URL}/topup/success`
cancelUrl:  `${env.PUBLIC_URL}/topup/cancel`
```

`PUBLIC_URL` resolves to the worker itself (`https://agentic-polsci.agps.workers.dev`, per `worker/wrangler.toml`). `worker/src/index.ts` mounts `/ping`, `/demo/paid`, REST routes, the webhook, and MCP — but no `/topup/*`. After a successful payment, Stripe redirects the browser to a 404. (The webhook still credits the balance asynchronously, so funds *are* added — but the user experience reads as broken.)

**Bug 2 — `stripe_customer_id` never written back.** `topup_balance.ts:32-44` *reads* `users.stripe_customer_id` and forwards it to Stripe Checkout via the `customer` param so repeat topups attach to one Stripe customer. But `stripe_webhook.ts:18-26` only writes `payment_events` and updates `balances` — it never persists the customer id back to the `users` row. The column (declared at `worker/migrations/0001_init.sql:7`) stays NULL forever; every topup spawns a new Stripe customer; the read-then-pass code in `topup_balance.ts` is dead.

## 3. Design

### 3.1 Add the redirect routes (Bug 1)

In `worker/src/index.ts`, mount two `GET` handlers next to the existing `/demo/paid` page. Same minimal HTML + style.

`GET /topup/success`:

- Reads `?session_id=` from the query string (Stripe templates `{CHECKOUT_SESSION_ID}` server-side when present in `success_url`).
- Renders: heading "Payment received", body explaining that the balance is credited asynchronously by the Stripe webhook (typically within a few seconds), and instruction to run `polsci balance` to confirm. Shows the session id.
- No auth, no DB read, no Stripe API call.

`GET /topup/cancel`:

- Renders: heading "Payment cancelled", body "No charge was made. Run `polsci topup --amount <usd>` to retry."

Both pages match the existing `/demo/paid` style: monospace, max-width 540, plain text. No CSS framework, no JavaScript, no images.

### 3.2 Pass session id into success URL (Bug 1, supporting)

`worker/src/handlers/topup_balance.ts:42` — change:

```ts
successUrl: `${env.PUBLIC_URL}/topup/success`,
```

to:

```ts
successUrl: `${env.PUBLIC_URL}/topup/success?session_id={CHECKOUT_SESSION_ID}`,
```

Stripe's `success_url` substitutes `{CHECKOUT_SESSION_ID}` with the actual id before redirecting, so the page can show it. No behavioral risk — if Stripe ever stops doing the substitution, the page just shows the literal `{CHECKOUT_SESSION_ID}` string, harmless.

### 3.3 Write back `stripe_customer_id` on first topup (Bug 2)

Three file changes.

**`worker/src/lib/stripe.ts`** — two changes:

(a) `createCheckoutSession`: when no `customerId` is passed, force Stripe to create a customer for the session by setting `customer_creation: "always"` on the form payload. Without this, Stripe Checkout in `mode: payment` defaults to `customer_creation: "if_required"`, which for most card payments creates *no* customer — the event would arrive with `customer: null` and the writeback would never trigger. When a `customerId` IS already passed, do not set `customer_creation` (Stripe rejects combining the two).

(b) `parseCheckoutSessionCompleted`: extract the `customer` field from the event:

```ts
export type CheckoutSessionCompleted = {
  event_id: string;
  user_id: string;
  amount_cents: number;
  customer_id: string | null;   // new
};
```

Pull from `event.data.object.customer` (a string or null in Stripe's event shape).

**`worker/src/handlers/stripe_webhook.ts`** — extend the `DB.batch` to conditionally update `users.stripe_customer_id`. Use a guarded UPDATE so we never overwrite an already-set value:

```sql
UPDATE users SET stripe_customer_id = ?
 WHERE user_id = ? AND stripe_customer_id IS NULL
```

Only enqueue this statement when `evt.customer_id` is non-null. Add it as a third statement in the existing `DB.batch([...])` so it stays atomic with the payment-event insert and the balance update.

The guard makes the operation idempotent across replays (same as the existing UNIQUE-on-`stripe_event_id` dedupe) and prevents a race in the unlikely case that two simultaneous first-topup events arrive for the same user — the second writeback is a no-op.

### 3.4 Tests

All under `worker/test/`.

**New: `test/handlers/topup_pages.test.ts`** (or fold into `test/transports/rest.test.ts` — pick whichever yields a cleaner diff in the implementation plan).

- `GET /topup/success?session_id=cs_test_abc` → 200, content-type `text/html`, body contains "Payment received" and "cs_test_abc" and "polsci balance".
- `GET /topup/success` (no query) → 200, body contains "Payment received" but no session id literal.
- `GET /topup/cancel` → 200, body contains "Payment cancelled" and "polsci topup".

**Extend: `test/handlers/stripe_webhook.test.ts`**.

- Writes back `stripe_customer_id` when the user's column is NULL and the event carries a `customer`.
- Does NOT overwrite when the user already has a `stripe_customer_id` set (seed a different value, fire the webhook, assert the original value is unchanged).

**Extend: `test/helpers/stripe-mock.ts`**. `makeCheckoutCompletedEvent` gains an optional `customer?: string` field that, when set, lands at `event.data.object.customer`. Default omitted (existing tests stay green).

**Extend: `test/handlers/topup_balance.test.ts`** — add one case asserting that the form body submitted to Stripe includes `customer_creation=always` when no `customerId` is on the user, and does NOT include it when a `customerId` is present. (Inspect the captured `fetchSpy` body to verify.)

## 4. Files touched

| Path | Change |
|---|---|
| `worker/src/index.ts` | Mount `GET /topup/success` and `GET /topup/cancel`. |
| `worker/src/handlers/topup_balance.ts` | Append `?session_id={CHECKOUT_SESSION_ID}` to success URL. |
| `worker/src/lib/stripe.ts` | `createCheckoutSession` sets `customer_creation: "always"` when no `customerId`; `parseCheckoutSessionCompleted` extracts `customer`. |
| `worker/src/handlers/stripe_webhook.ts` | Conditional guarded UPDATE on `users.stripe_customer_id`. |
| `worker/test/handlers/stripe_webhook.test.ts` | +2 cases (writeback when NULL; no overwrite). |
| `worker/test/handlers/topup_balance.test.ts` | +1 case (form includes/omits `customer_creation`). |
| `worker/test/handlers/topup_pages.test.ts` (new) | 3 cases. |
| `worker/test/helpers/stripe-mock.ts` | Optional `customer` arg on event factory. |

## 5. Out of scope

- **CLI changes.** `cli/src/commands/topup.ts` works correctly today.
- **Site changes.** `for-humans` and `for-agents` already describe the flow correctly.
- **MCP surface.** `topup_balance` is exposed; description is accurate.
- **Operator dashboard config.** Whether the Stripe dashboard's webhook endpoint is correctly wired to `https://agentic-polsci.agps.workers.dev/webhooks/stripe` is a deployment concern, not a code change. (Worth verifying out-of-band; if it isn't wired, no balance ever credits, regardless of this spec's changes.)
- **Showing live balance on the success page.** Would require authenticating the browser visitor on a public Stripe redirect URL; no clean path at alpha.
- **Server-side session lookup via Stripe API on the success page.** Adds a per-page-load Stripe call for confidence the webhook will deliver — but the webhook is the actual source of truth, so the lookup adds no real reliability.

## 6. Risks and follow-ups

- **Operator-side webhook misconfiguration is invisible from this code.** If the Stripe dashboard's webhook URL is wrong or the signing secret rotated without `wrangler secret put STRIPE_WEBHOOK_SECRET`, balances silently never credit. Mitigation: the success page text already directs users to `polsci balance`, which surfaces the discrepancy quickly. Real fix is operator vigilance plus a future health-check route — out of scope here.
- **`{CHECKOUT_SESSION_ID}` substitution depends on Stripe's templating contract.** Documented and stable for years; safe.
- **`stripe_customer_id` write-back is best-effort.** If Stripe ever sends a `checkout.session.completed` event without a `customer` field (e.g. an unusual payment-method path that ignored `customer_creation: "always"`), the writeback simply doesn't happen — the user's column stays NULL and the next topup creates yet another Stripe customer. Acceptable at alpha; the read-then-pass code in `topup_balance.ts` already handles NULL.
- **Switching `customer_creation` to "always" creates a Stripe customer per first topup even if the user never tops up again.** Operator may end up with a small set of one-payment customers in the Stripe dashboard. Negligible; Stripe customers are free.
