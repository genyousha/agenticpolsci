import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type StrategyEntry = {
  day: 1 | 2 | 3;
  order: number;
  handle: string;
  reason: string;
};

const STRATEGY_RELATIVE_PATH = "social/follow-strategy.md";
const BELL_LIST_HEADING = "### Bell notifications — top 10 only";

const DAY_HEADING_RE = /^###\s+Day\s+([123])\b/i;
const TABLE_ROW_RE = /^\|\s*(\d+)\s*\|\s*\[?@(\w+)\]?(?:\([^)]*\))?\s*\|\s*([^|]+?)\s*\|\s*$/;

/**
 * Parse follow-strategy.md and return the ordered queue of (day, order, handle).
 * Day 1 entries come first, then Day 2, then Day 3.
 */
export function readStrategyQueue(repoRoot: string): StrategyEntry[] {
  const path = join(repoRoot, STRATEGY_RELATIVE_PATH);
  if (!existsSync(path)) {
    throw new Error(`follow-strategy.md not found at ${path}`);
  }
  const text = readFileSync(path, "utf-8");
  return parseStrategyQueue(text);
}

export function parseStrategyQueue(text: string): StrategyEntry[] {
  const lines = text.split("\n");
  const out: StrategyEntry[] = [];
  let currentDay: 1 | 2 | 3 | null = null;
  for (const line of lines) {
    const dayMatch = DAY_HEADING_RE.exec(line);
    if (dayMatch) {
      currentDay = Number(dayMatch[1]) as 1 | 2 | 3;
      continue;
    }
    if (line.startsWith("### ") && !DAY_HEADING_RE.test(line)) {
      currentDay = null;
      continue;
    }
    if (currentDay === null) continue;
    const row = TABLE_ROW_RE.exec(line);
    if (!row) continue;
    out.push({
      day: currentDay,
      order: Number(row[1]),
      handle: row[2]!,
      reason: row[3]!.trim(),
    });
  }
  out.sort((a, b) => a.day - b.day || a.order - b.order);
  return out;
}

/**
 * Return the top-10 bell-notification handles (used for reply scraping).
 */
export function readBellList(repoRoot: string): string[] {
  const path = join(repoRoot, STRATEGY_RELATIVE_PATH);
  if (!existsSync(path)) {
    throw new Error(`follow-strategy.md not found at ${path}`);
  }
  return parseBellList(readFileSync(path, "utf-8"));
}

export function parseBellList(text: string): string[] {
  const lines = text.split("\n");
  const handles: string[] = [];
  let inSection = false;
  for (const line of lines) {
    if (line.trim() === BELL_LIST_HEADING) {
      inSection = true;
      continue;
    }
    if (inSection && line.startsWith("###")) break;
    if (!inSection) continue;
    const m = /^\d+\.\s+@(\w+)/.exec(line.trim());
    if (m) handles.push(m[1]!);
  }
  return handles;
}
