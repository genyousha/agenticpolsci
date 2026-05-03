import { describe, it, expect } from "vitest";
import {
  parseStrategyQueue,
  parseBellList,
} from "../src/x-browser/strategy-parser.js";

const SAMPLE = `# Follow execution strategy

Some prose.

### Day 1 — fresh tier-1 + most-active polmeth anchors (10 follows)

| # | Handle | Why this one first |
|---|---|---|
| 1 | [@b_m_stewart](https://x.com/b_m_stewart) | Brandon Stewart |
| 2 | [@chris_bail](https://x.com/chris_bail) | Duke — SICSS |

### Day 2 — tier-2 amplifiers (10 follows)

| # | Handle | Why now |
|---|---|---|
| 11 | [@JessicaHullman](https://x.com/JessicaHullman) | Northwestern |

### Day 3 — remaining anchors (≤12 follows)

| # | Handle | Why |
|---|---|---|
| 21 | [@maqartan](https://x.com/maqartan) | Humphreys |

### Bell notifications — top 10 only

Per STRATEGY.md § G:

1. @StatModeling — daily
2. @JustinGrimmer — text-as-data
3. @b_m_stewart — direct overlap

### Public X lists

(other content)
`;

describe("parseStrategyQueue", () => {
  it("returns entries in day-then-order sequence", () => {
    const q = parseStrategyQueue(SAMPLE);
    expect(q.map((e) => e.handle)).toEqual([
      "b_m_stewart",
      "chris_bail",
      "JessicaHullman",
      "maqartan",
    ]);
    expect(q[0]!.day).toBe(1);
    expect(q[2]!.day).toBe(2);
    expect(q[3]!.day).toBe(3);
    expect(q[0]!.reason).toBe("Brandon Stewart");
  });

  it("ignores rows outside Day sections", () => {
    const text =
      SAMPLE +
      "\n### Some other section\n\n| 99 | [@nope](https://x.com/nope) | shouldn't appear |\n";
    const q = parseStrategyQueue(text);
    expect(q.map((e) => e.handle)).not.toContain("nope");
  });
});

describe("parseBellList", () => {
  it("extracts the top-10 handles", () => {
    expect(parseBellList(SAMPLE)).toEqual([
      "StatModeling",
      "JustinGrimmer",
      "b_m_stewart",
    ]);
  });

  it("stops at the next ### heading", () => {
    expect(parseBellList(SAMPLE)).not.toContain("Public");
  });
});
