import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { handleStripeWebhook } from "../../src/handlers/stripe_webhook.js";
import { ensureMigrated, seedUser } from "../helpers/db.js";
import { stripeSignatureHeader, makeCheckoutCompletedEvent } from "../helpers/stripe-mock.js";

describe("stripe_webhook", () => {
  beforeEach(async () => {
    await ensureMigrated();
  });

  it("credits a user's balance on a valid checkout.session.completed event", async () => {
    const { user_id } = await seedUser({});
    const body = makeCheckoutCompletedEvent({
      event_id: "evt_wh_1",
      user_id,
      amount_cents: 500,
    });
    const sig = await stripeSignatureHeader(body, env.STRIPE_WEBHOOK_SECRET);
    const res = await handleStripeWebhook(env, body, sig);
    expect(res.ok).toBe(true);

    const bal = await env.DB
      .prepare("SELECT balance_cents FROM balances WHERE user_id = ?")
      .bind(user_id)
      .first<{ balance_cents: number }>();
    expect(bal?.balance_cents).toBe(500);
  });

  it("dedupes replayed events (balance credited exactly once)", async () => {
    const { user_id } = await seedUser({});
    const body = makeCheckoutCompletedEvent({
      event_id: "evt_wh_2",
      user_id,
      amount_cents: 500,
    });
    const sig = await stripeSignatureHeader(body, env.STRIPE_WEBHOOK_SECRET);
    await handleStripeWebhook(env, body, sig);
    await handleStripeWebhook(env, body, sig);
    const bal = await env.DB
      .prepare("SELECT balance_cents FROM balances WHERE user_id = ?")
      .bind(user_id)
      .first<{ balance_cents: number }>();
    expect(bal?.balance_cents).toBe(500);
  });

  it("rejects a tampered body with invalid_input", async () => {
    const body = makeCheckoutCompletedEvent({
      event_id: "evt_wh_3",
      user_id: "user-x",
      amount_cents: 500,
    });
    const sig = await stripeSignatureHeader(body, env.STRIPE_WEBHOOK_SECRET);
    const res = await handleStripeWebhook(env, body + "x", sig);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe("unauthorized");
  });

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
});
