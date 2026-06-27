import { describe, it, expect } from "vitest";
import {
  segmentAngle,
  segmentColors,
  buildSegments,
  winnerIndexForRotation,
  rotationForWinner,
  pickWinnerIndex,
} from "./wheel";

describe("segmentAngle", () => {
  it("splits the circle evenly", () => {
    expect(segmentAngle(4)).toBe(90);
    expect(segmentAngle(3)).toBe(120);
    expect(segmentAngle(1)).toBe(360);
  });
});

describe("buildSegments", () => {
  const names = ["A", "B", "C", "D"];
  const segments = buildSegments(names);

  it("creates one segment per name", () => {
    expect(segments).toHaveLength(4);
    expect(segments.map((s) => s.name)).toEqual(names);
  });

  it("covers the full circle without gaps", () => {
    expect(segments[0].startAngle).toBe(0);
    expect(segments[segments.length - 1].endAngle).toBeCloseTo(360);
    for (let i = 1; i < segments.length; i++) {
      expect(segments[i].startAngle).toBeCloseTo(segments[i - 1].endAngle);
    }
  });

  it("places the mid angle in the middle of each slice", () => {
    expect(segments[0].midAngle).toBeCloseTo(45);
    expect(segments[1].midAngle).toBeCloseTo(135);
  });

  it("assigns a colour to every segment with no two neighbours equal (incl. wrap)", () => {
    const many = buildSegments(Array.from({ length: 7 }, (_, i) => `N${i}`));
    for (let i = 0; i < many.length; i++) {
      expect(many[i].color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      const next = many[(i + 1) % many.length];
      expect(many[i].color).not.toBe(next.color);
    }
  });
});

describe("segmentColors", () => {
  it("never repeats a colour on adjacent slices, including the wrap-around", () => {
    for (let count = 1; count <= 30; count++) {
      const colors = segmentColors(count);
      expect(colors).toHaveLength(count);
      for (let i = 0; i < count; i++) {
        expect(colors[i]).toMatch(/^#[0-9A-Fa-f]{6}$/);
        if (count > 1) {
          expect(colors[i]).not.toBe(colors[(i + 1) % count]);
        }
      }
    }
  });
});

describe("winnerIndexForRotation", () => {
  it("returns the segment under the top pointer at rest", () => {
    // 4 segments, no rotation: segment 0 spans [0,90) at the top.
    expect(winnerIndexForRotation(4, 0)).toBe(0);
  });

  it("accounts for clockwise rotation", () => {
    // Rotating the wheel clockwise brings earlier segments under the pointer.
    expect(winnerIndexForRotation(4, 90)).toBe(3);
    expect(winnerIndexForRotation(4, 180)).toBe(2);
  });

  it("is stable across multiple full turns", () => {
    expect(winnerIndexForRotation(4, 360 * 5 + 90)).toBe(3);
  });
});

describe("rotationForWinner / winnerIndexForRotation round-trip", () => {
  it("always lands on the requested winner", () => {
    for (const count of [1, 2, 3, 5, 8, 12]) {
      for (let index = 0; index < count; index++) {
        const rotation = rotationForWinner(index, count, 0, 5);
        expect(winnerIndexForRotation(count, rotation)).toBe(index);
      }
    }
  });

  it("always spins forward past the requested number of turns", () => {
    const current = 123;
    const rotation = rotationForWinner(2, 6, current, 4);
    expect(rotation).toBeGreaterThanOrEqual(current + 4 * 360);
  });
});

describe("pickWinnerIndex", () => {
  it("uses the injected random source", () => {
    expect(pickWinnerIndex(10, () => 0)).toBe(0);
    expect(pickWinnerIndex(10, () => 0.99)).toBe(9);
    expect(pickWinnerIndex(4, () => 0.5)).toBe(2);
  });

  it("stays within range", () => {
    for (let i = 0; i < 100; i++) {
      const idx = pickWinnerIndex(7, () => i / 100);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(7);
    }
  });
});
