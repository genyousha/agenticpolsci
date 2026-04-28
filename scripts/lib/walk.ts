import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { validate, type ValidationResult } from "./validate.js";
import { readYaml, readMarkdownFrontmatter } from "./yaml.js";
import type { SchemaName } from "./schemas.js";

function readJsonl(abs: string): unknown[] {
  const text = readFileSync(abs, "utf-8");
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l));
}

export type WalkResult = {
  path: string;
  schemaName: SchemaName;
  result: ValidationResult;
};

type Rule = {
  match: (rel: string) => boolean;
  schema: SchemaName;
  load: (abs: string) => unknown;
};

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "coverage",
  "docs",
  "worker",
  "schemas",
  "scripts",
  "tests",
]);

const RULES: Rule[] = [
  {
    match: (r) => /^journals\/[^/]+\.ya?ml$/.test(r),
    schema: "journal",
    load: readYaml,
  },
  {
    match: (r) => /^agents\/[^/]+\.ya?ml$/.test(r),
    schema: "agent",
    load: readYaml,
  },
  {
    match: (r) => /^issues\/[^/]+\.ya?ml$/.test(r),
    schema: "issue",
    load: readYaml,
  },
  {
    match: (r) => /^papers\/[^/]+\/metadata\.ya?ml$/.test(r),
    schema: "paper-metadata",
    load: readYaml,
  },
  {
    match: (r) =>
      /^papers\/[^/]+\/reviews\/review-\d{3,}\.invitation\.ya?ml$/.test(r),
    schema: "review-invitation",
    load: readYaml,
  },
  {
    match: (r) => /^papers\/[^/]+\/reviews\/review-\d{3,}\.md$/.test(r),
    schema: "review-frontmatter",
    load: (p) => readMarkdownFrontmatter(p).frontmatter,
  },
  {
    match: (r) => /^papers\/[^/]+\/decision\.md$/.test(r),
    schema: "decision-frontmatter",
    load: (p) => readMarkdownFrontmatter(p).frontmatter,
  },
  {
    match: (r) => /^papers\/[^/]+\/tweets\.ya?ml$/.test(r),
    schema: "tweets",
    load: readYaml,
  },
  {
    match: (r) => /^site\/tweets\.ya?ml$/.test(r),
    schema: "site-tweets",
    load: readYaml,
  },
  {
    match: (r) => r === "social/posts.log.jsonl",
    schema: "posts-log-entry",
    load: readJsonl,
  },
];

export function walkAndValidate(root: string): WalkResult[] {
  const results: WalkResult[] = [];
  walk(root, root, results);
  return results;
}

function walk(root: string, dir: string, out: WalkResult[]): void {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    if (SKIP_DIRS.has(entry)) continue;
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) {
      walk(root, abs, out);
      continue;
    }
    const rel = relative(root, abs).replace(/\\/g, "/");
    const rule = RULES.find((r) => r.match(rel));
    if (!rule) continue;
    let data: unknown;
    try {
      data = rule.load(abs);
    } catch (err) {
      out.push({
        path: abs,
        schemaName: rule.schema,
        result: {
          valid: false,
          errors: [
            {
              instancePath: "",
              keyword: "parse",
              params: {},
              schemaPath: "",
              message: `parse error: ${(err as Error).message}`,
            },
          ],
        },
      });
      continue;
    }
    if (rule.schema === "posts-log-entry" && Array.isArray(data)) {
      data.forEach((entry, i) => {
        out.push({
          path: `${abs}:${i + 1}`,
          schemaName: rule.schema,
          result: validate(rule.schema, entry),
        });
      });
      continue;
    }
    out.push({
      path: abs,
      schemaName: rule.schema,
      result: validate(rule.schema, data),
    });
  }
}
