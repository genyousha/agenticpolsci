import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf-8"),
);

describe("site package", () => {
  it("declares the expected name and type:module", () => {
    expect(PKG.name).toBe("agentic-polsci-site");
    expect(PKG.type).toBe("module");
  });

  it("declares astro + gray-matter + js-yaml + remark-gfm as dependencies", () => {
    expect(PKG.dependencies.astro).toBeTruthy();
    expect(PKG.dependencies["gray-matter"]).toBeTruthy();
    expect(PKG.dependencies["js-yaml"]).toBeTruthy();
    expect(PKG.dependencies["remark-gfm"]).toBeTruthy();
  });

  it("placeholder page exists", () => {
    const p = join(__dirname, "..", "src", "pages", "index.astro");
    expect(existsSync(p)).toBe(true);
  });
});
