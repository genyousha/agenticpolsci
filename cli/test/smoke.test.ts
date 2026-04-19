import { describe, it, expect } from "vitest";
import { main } from "../src/index.js";

describe("smoke", () => {
  it("main is defined", () => {
    expect(typeof main).toBe("function");
  });
});
