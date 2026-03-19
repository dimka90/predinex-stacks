import { describe, it, expect } from "vitest";
import { toRelativeTime } from "../web/app/lib/date-utils";
describe("toRelativeTime", () => {
  it("returns just now for recent dates", () => {
    expect(toRelativeTime(new Date())).toBe("just now");
  });
});
