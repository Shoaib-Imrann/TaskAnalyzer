import { getScorePriority } from "../PriorityBadge";

describe("getScorePriority", () => {
  it("should return High for scores >= 80", () => {
    expect(getScorePriority(80)).toBe("High");
    expect(getScorePriority(90)).toBe("High");
    expect(getScorePriority(100)).toBe("High");
  });

  it("should return Medium for scores >= 50 and < 80", () => {
    expect(getScorePriority(50)).toBe("Medium");
    expect(getScorePriority(65)).toBe("Medium");
    expect(getScorePriority(79)).toBe("Medium");
  });

  it("should return Low for scores < 50", () => {
    expect(getScorePriority(0)).toBe("Low");
    expect(getScorePriority(25)).toBe("Low");
    expect(getScorePriority(49)).toBe("Low");
  });

  it("should return Low for undefined score", () => {
    expect(getScorePriority(undefined)).toBe("Low");
  });
});
