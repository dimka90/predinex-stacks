import { describe, it, expect } from "vitest";
import { MAX_BET_AMOUNT, MIN_BET_AMOUNT, PROTOCOL_FEE_BPS } from "../web/app/lib/constants";
describe("protocol constants", () => {
  it("max bet is greater than min bet", () => { expect(MAX_BET_AMOUNT).toBeGreaterThan(MIN_BET_AMOUNT); });
  it("protocol fee is 1%", () => { expect(PROTOCOL_FEE_BPS).toBe(100); });
});
