import { describe, it, expect } from "vitest";
import { selectForSlot } from "../src/select.js";
import type { PaperMetadata, PostLogEntry } from "../src/types.js";

const NOW = new Date("2026-04-28T15:00:00Z");

const paperA: PaperMetadata = {
  paper_id: "paper-2026-0001",
  title: "A",
  status: "accepted",
  decided_at: "2026-04-27T12:00:00Z",
  author_agent_ids: ["agent-a"],
};
const paperB: PaperMetadata = {
  paper_id: "paper-2026-0002",
  title: "B",
  status: "accepted",
  decided_at: "2026-04-20T12:00:00Z",
  author_agent_ids: ["agent-b"],
};
const paperC: PaperMetadata = {
  paper_id: "paper-2026-0003",
  title: "C",
  status: "accepted",
  decided_at: "2026-04-01T12:00:00Z",
  author_agent_ids: ["agent-c"],
};

describe("selectForSlot site_promo", () => {
  it("picks lowest unused variant_idx when log empty", () => {
    const sel = selectForSlot({
      slot: "site_promo",
      papers: [],
      log: [],
      siteVariantCount: 5,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    expect(sel.variantIdx).toBe(0);
    expect(sel.degraded).toBe(false);
  });

  it("picks the least-recently-used variant", () => {
    const log: PostLogEntry[] = [
      mk("2026-04-28T09:00:00Z", "site_promo", "site", 0),
      mk("2026-04-26T09:00:00Z", "site_promo", "site", 1),
      mk("2026-04-27T09:00:00Z", "site_promo", "site", 2),
    ];
    const sel = selectForSlot({
      slot: "site_promo",
      papers: [],
      log,
      siteVariantCount: 3,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    // Variant 1 was used Apr 26 (oldest) → pick 1.
    expect(sel.variantIdx).toBe(1);
  });
});

describe("selectForSlot newest", () => {
  it("picks paper with latest decided_at", () => {
    const sel = selectForSlot({
      slot: "newest",
      papers: [paperA, paperB, paperC],
      log: [],
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("paper-2026-0001");
    expect(sel.degraded).toBe(false);
  });

  it("falls back to second-newest if newest posted in last 24h", () => {
    const log: PostLogEntry[] = [
      mk("2026-04-28T05:00:00Z", "newest", "paper-2026-0001", 0),
    ];
    const sel = selectForSlot({
      slot: "newest",
      papers: [paperA, paperB, paperC],
      log,
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("paper-2026-0002");
  });

  it("degrades to site_promo if <2 accepted papers", () => {
    const sel = selectForSlot({
      slot: "newest",
      papers: [paperA],
      log: [mk("2026-04-28T05:00:00Z", "newest", "paper-2026-0001", 0)],
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    expect(sel.degraded).toBe(true);
  });
});

describe("selectForSlot catalog", () => {
  it("picks least-recently-posted paper outside cooldown", () => {
    const log: PostLogEntry[] = [
      mk("2026-04-27T09:00:00Z", "catalog", "paper-2026-0002", 0),
      // paperA, paperC never posted. paperA decided later, paperC older.
      // Both never posted → tie; tie broken by oldest decided_at → paperC.
    ];
    const sel = selectForSlot({
      slot: "catalog",
      papers: [paperA, paperB, paperC],
      log,
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("paper-2026-0003");
  });

  it("excludes papers posted within cooldown", () => {
    const log: PostLogEntry[] = [
      mk("2026-04-25T09:00:00Z", "catalog", "paper-2026-0001", 0),
      mk("2026-04-25T09:00:00Z", "catalog", "paper-2026-0002", 0),
      mk("2026-04-25T09:00:00Z", "catalog", "paper-2026-0003", 0),
    ];
    const sel = selectForSlot({
      slot: "catalog",
      papers: [paperA, paperB, paperC],
      log,
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    expect(sel.degraded).toBe(true);
  });

  it("degrades when no accepted papers", () => {
    const sel = selectForSlot({
      slot: "catalog",
      papers: [],
      log: [],
      siteVariantCount: 30,
      now: NOW,
    });
    expect(sel.source).toBe("site");
    expect(sel.degraded).toBe(true);
  });
});

describe("variant selection within a paper", () => {
  it("picks least-used variant_idx for that paper", () => {
    const log: PostLogEntry[] = [
      mk("2026-02-01T00:00:00Z", "catalog", "paper-2026-0003", 0),
      mk("2026-02-15T00:00:00Z", "catalog", "paper-2026-0003", 1),
      // both >14d ago, so paperC is eligible again.
    ];
    const sel = selectForSlot({
      slot: "catalog",
      papers: [paperC],
      log,
      siteVariantCount: 30,
      paperVariantCounts: { "paper-2026-0003": 5 },
      now: NOW,
    });
    expect(sel.source).toBe("paper-2026-0003");
    expect(sel.variantIdx).toBe(2);
  });
});

function mk(
  ts: string,
  slot: "site_promo" | "newest" | "catalog",
  source: string,
  idx: number,
): PostLogEntry {
  return {
    timestamp: ts,
    slot,
    source,
    variant_idx: idx,
    tweet_id: "x",
    tweet_url: "https://x.com/x/status/x",
  };
}
