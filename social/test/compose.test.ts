import { describe, it, expect } from "vitest";
import {
  composeMainTweet,
  composeReplyBody,
  topicToHashtag,
} from "../src/compose.js";

describe("topicToHashtag", () => {
  it("camel-cases a slug", () => {
    expect(topicToHashtag("formal-theory")).toBe("#FormalTheory");
    expect(topicToHashtag("autocracy")).toBe("#Autocracy");
    expect(topicToHashtag("bayesian-persuasion")).toBe("#BayesianPersuasion");
  });
});

describe("composeMainTweet", () => {
  const variant = "AI agents just replicated an AJPS paper.";
  const title = "Calibrating the dictator's dilemma";

  it("includes variant + title + hashtags when they fit", () => {
    const out = composeMainTweet({
      variant,
      title,
      topics: ["formal-theory", "autocracy"],
    });
    expect(out).toContain(variant);
    expect(out).toContain(title);
    expect(out).toContain("#FormalTheory");
    expect(out).toContain("#Autocracy");
    expect(out.length).toBeLessThanOrEqual(280);
  });

  it("never includes a URL — links go in the self-reply", () => {
    const out = composeMainTweet({
      variant,
      title,
      topics: ["formal-theory"],
    });
    expect(out).not.toMatch(/https?:\/\//);
  });

  it("drops hashtags when adding them would overflow", () => {
    const longTitle = "A".repeat(220);
    const out = composeMainTweet({
      variant,
      title: longTitle,
      topics: ["formal-theory", "autocracy"],
    });
    expect(out).not.toContain("#");
    expect(out.length).toBeLessThanOrEqual(280);
  });

  it("truncates title with ellipsis when needed", () => {
    const longTitle = "A".repeat(500);
    const out = composeMainTweet({
      variant,
      title: longTitle,
      topics: [],
    });
    expect(out.length).toBeLessThanOrEqual(280);
    expect(out).toContain("…");
    expect(out).toContain(variant);
  });

  it("falls back to variant alone when title can't be truncated to fit", () => {
    // With variant=279 chars, the title-budget after the joining space
    // is 0, which is < 4 (the truncation floor). Composer must fall
    // back to variant alone.
    const out = composeMainTweet({
      variant: "x".repeat(279),
      title: "B".repeat(500),
      topics: [],
    });
    expect(out.length).toBeLessThanOrEqual(280);
    expect(out).not.toContain("B");
    expect(out).toBe("x".repeat(279));
  });

  it("works with no topics", () => {
    const out = composeMainTweet({ variant, title, topics: [] });
    expect(out.length).toBeLessThanOrEqual(280);
    expect(out).not.toContain("#");
  });

  it("caps hashtags at MAX_HASHTAGS", () => {
    const out = composeMainTweet({
      variant: "short",
      title: "short",
      topics: ["a", "b", "c", "d", "e"],
    });
    const hashCount = (out.match(/#/g) ?? []).length;
    expect(hashCount).toBeLessThanOrEqual(3);
  });

  it("throws when even the variant alone overflows", () => {
    expect(() =>
      composeMainTweet({
        variant: "z".repeat(290),
        title: "title",
        topics: [],
      }),
    ).toThrow(/overflow/);
  });
});

describe("composeReplyBody", () => {
  it("returns the bare URL", () => {
    const url = "https://agenticpolsci.pages.dev/papers/paper-2026-0001/";
    expect(composeReplyBody({ url })).toBe(url);
  });

  it("throws on empty URL", () => {
    expect(() => composeReplyBody({ url: "" })).toThrow();
  });
});
