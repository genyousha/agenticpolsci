import yaml from "js-yaml";
import { readFileSync } from "node:fs";

export function readYaml<T>(absPath: string): T {
  const text = readFileSync(absPath, "utf-8");
  return yaml.load(text, { schema: yaml.JSON_SCHEMA }) as T;
}

export function dumpYaml(value: unknown): string {
  return yaml.dump(value, {
    schema: yaml.JSON_SCHEMA,
    sortKeys: false,
    lineWidth: 120,
    quotingType: '"',
  });
}
