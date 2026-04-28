import { describe, it, expect } from "vitest";
import { composeTweetBody, topicToHashtag } from "../src/compose.js";

describe("topicToHashtag", () => {
  it("camel-cases a slug", () => {
    expect(topicToHashtag("formal-theory")).toBe("#FormalTheory");
    expect(topicToHashtag("autocracy")).toBe("#Autocracy");
    expect(topicToHashtag("bayesian-persuasion")).toBe("#BayesianPersuasion");
  });
});

describe("composeTweetBody", () => {
  const url = "https://agenticpolsci.pages.dev/papers/paper-2026-0001/";
  const variant = "AI agents just replicated an AJPS paper.";
  const title = "Calibrating the dictator's dilemma";

  it("includes all fields when they fit", () => {
    const out = composeTweetBody({
      variant,
      title,
      topics: ["formal-theory", "autocracy"],
      url,
    });
    expect(out).toContain(variant);
    expect(out).toContain(title);
    expect(out).toContain("#FormalTheory");
    expect(out).toContain("#Autocracy");
    expect(out).toContain(url);
    expect(out.length).toBeLessThanOrEqual(280);
  });

  it("drops hashtags when adding them would overflow", () => {
    const longTitle = "A".repeat(180);
    const out = composeTweetBody({
      variant,
      title: longTitle,
      topics: ["formal-theory", "autocracy"],
      url,
    });
    expect(out).not.toContain("#");
    expect(out.length).toBeLessThanOrEqual(280);
  });

  it("truncates title with ellipsis when needed", () => {
    const longTitle = "A".repeat(500);
    const out = composeTweetBody({
      variant,
      title: longTitle,
      topics: [],
      url,
    });
    expect(out.length).toBeLessThanOrEqual(280);
    expect(out).toContain("…");
    expect(out).toContain(url);
  });

  it("drops title entirely as final fallback", () => {
    const out = composeTweetBody({
      variant: "x".repeat(220),
      title: "B".repeat(500),
      topics: [],
      url,
    });
    expect(out.length).toBeLessThanOrEqual(280);
    expect(out).toContain(url);
    expect(out).not.toContain("B");
  });

  it("works with no topics", () => {
    const out = composeTweetBody({ variant, title, topics: [], url });
    expect(out.length).toBeLessThanOrEqual(280);
    expect(out).not.toContain("#");
  });

  it("caps hashtags at MAX_HASHTAGS", () => {
    const out = composeTweetBody({
      variant: "short",
      title: "short",
      topics: ["a", "b", "c", "d", "e"],
      url,
    });
    const hashCount = (out.match(/#/g) ?? []).length;
    expect(hashCount).toBeLessThanOrEqual(3);
  });

  it("throws when even the minimal fallback would overflow", () => {
    expect(() =>
      composeTweetBody({
        variant: "z".repeat(280),
        title: "title",
        topics: [],
        url,
      }),
    ).toThrow(/overflow/);
  });
});
