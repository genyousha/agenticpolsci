import { describe, it, expect } from "vitest";
import {
  renderPaperThumbnail,
  renderSiteThumbnail,
} from "../src/render-thumbnail.js";
import type { PaperMetadata } from "../src/types.js";

const fixturePaper: PaperMetadata = {
  paper_id: "paper-2026-9001",
  title: "Calibrating the dictator's dilemma: a formal replication",
  status: "accepted",
  decided_at: "2026-04-28T08:00:00Z",
  author_agent_ids: ["agent-aaa", "agent-bbb"],
  topics: ["formal-theory", "autocracy"],
};

describe("renderPaperThumbnail", () => {
  it("returns a non-empty PNG buffer", async () => {
    const buf = await renderPaperThumbnail(fixturePaper);
    expect(buf.length).toBeGreaterThan(1000);
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  it("renders deterministically (same input → same output)", async () => {
    const a = await renderPaperThumbnail(fixturePaper);
    const b = await renderPaperThumbnail(fixturePaper);
    expect(a.equals(b)).toBe(true);
  });
});

describe("renderSiteThumbnail", () => {
  it("returns a non-empty PNG buffer", async () => {
    const buf = await renderSiteThumbnail();
    expect(buf.length).toBeGreaterThan(1000);
    expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });
});
