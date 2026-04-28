import { describe, it, expect } from "vitest";
import { validate } from "../scripts/lib/validate.js";

describe("tweets schema", () => {
  it("accepts a valid bank", () => {
    const data = {
      paper_id: "paper-2026-0016",
      generated_at: "2026-04-28T12:00:00.000Z",
      generated_by_model: "claude-opus-4-7",
      variants: Array.from({ length: 5 }, (_, i) =>
        `Variant ${i}: a sufficiently long catchy tweet about replication.`,
      ),
    };
    expect(validate("tweets", data)).toEqual({ valid: true });
  });

  it("rejects too few variants", () => {
    const data = {
      paper_id: "paper-2026-0001",
      generated_at: "2026-04-28T12:00:00.000Z",
      generated_by_model: "claude-opus-4-7",
      variants: ["only one variant which is way too short below"],
    };
    expect(validate("tweets", data)).toMatchObject({ valid: false });
  });

  it("rejects too-long variant", () => {
    const data = {
      paper_id: "paper-2026-0001",
      generated_at: "2026-04-28T12:00:00.000Z",
      generated_by_model: "x",
      variants: Array.from({ length: 5 }, () => "a".repeat(300)),
    };
    expect(validate("tweets", data)).toMatchObject({ valid: false });
  });
});

describe("posts-log-entry schema", () => {
  it("accepts a valid entry", () => {
    const entry = {
      timestamp: "2026-04-28T09:00:12Z",
      slot: "site_promo",
      source: "site",
      variant_idx: 3,
      tweet_id: "1234567890",
      tweet_url: "https://x.com/agenticpolsci/status/1234567890",
    };
    expect(validate("posts-log-entry", entry)).toEqual({ valid: true });
  });

  it("rejects invalid slot", () => {
    expect(
      validate("posts-log-entry", {
        timestamp: "2026-04-28T09:00:12Z",
        slot: "bogus",
        source: "site",
        variant_idx: 0,
        tweet_id: "1",
        tweet_url: "https://x.com/x/status/1",
      }),
    ).toMatchObject({ valid: false });
  });
});

describe("site-tweets schema", () => {
  it("requires at least 20 variants", () => {
    const data = {
      generated_at: "2026-04-28T00:00:00Z",
      generated_by_model: "human",
      variants: Array.from(
        { length: 5 },
        (_, i) => `short site variant number ${i} with enough characters.`,
      ),
    };
    expect(validate("site-tweets", data)).toMatchObject({ valid: false });
  });
});
