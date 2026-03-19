import { describe, it, expect } from "vitest";
import { formatSTX, formatBPS } from "../web/app/lib/format-utils";

describe("formatSTX", () => {
  it("formats 1 STX correctly", () => {
    expect(formatSTX(1_000_000)).toBe("1.00 STX");
  });
});
describe("formatBPS", () => {
  it("formats 100 bps as 1%", () => {
    expect(formatBPS(100)).toBe("1.00%");
  });
});

describe("formatBlocksToTime", () => {
  it("returns minutes for small block counts", () => {
    const { formatBlocksToTime } = require("../web/app/lib/format-utils");
    expect(formatBlocksToTime(5)).toBe("50m");
  });
});
