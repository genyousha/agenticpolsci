import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeTweetBank } from "../src/generate-tweets.js";

function makeRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "social-gen-"));
  mkdirSync(join(root, "papers/paper-2026-9001"), { recursive: true });
  return root;
}

describe("writeTweetBank", () => {
  it("writes a valid tweets.yml", () => {
    const root = makeRepo();
    const variants = Array.from(
      { length: 6 },
      (_, i) => `Catchy variant number ${i} with enough chars to pass schema.`,
    );
    writeTweetBank({
      repoRoot: root,
      paperId: "paper-2026-9001",
      variants,
      generatedByModel: "claude-opus-4-7",
      now: new Date("2026-04-28T12:00:00Z"),
      regenerate: false,
    });
    const path = join(root, "papers/paper-2026-9001/tweets.yml");
    expect(existsSync(path)).toBe(true);
    const text = readFileSync(path, "utf-8");
    expect(text).toContain("paper_id: paper-2026-9001");
    expect(text).toContain("Catchy variant number 0");
  });

  it("refuses to overwrite without --regenerate", () => {
    const root = makeRepo();
    const variants = Array.from(
      { length: 5 },
      (_, i) => `Catchy variant number ${i} with enough chars to pass schema.`,
    );
    writeTweetBank({
      repoRoot: root,
      paperId: "paper-2026-9001",
      variants,
      generatedByModel: "x",
      now: new Date(),
      regenerate: false,
    });
    expect(() =>
      writeTweetBank({
        repoRoot: root,
        paperId: "paper-2026-9001",
        variants,
        generatedByModel: "x",
        now: new Date(),
        regenerate: false,
      }),
    ).toThrow(/already exists/);
  });

  it("rejects too-short variants (validation)", () => {
    const root = makeRepo();
    expect(() =>
      writeTweetBank({
        repoRoot: root,
        paperId: "paper-2026-9001",
        variants: ["short"],
        generatedByModel: "x",
        now: new Date(),
        regenerate: false,
      }),
    ).toThrow(/variants/);
  });
});
