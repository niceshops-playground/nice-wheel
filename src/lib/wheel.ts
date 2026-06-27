/**
 * Pure geometry + winner maths for the wheel.
 *
 * Angle convention: degrees, 0° at the top (12 o'clock), increasing clockwise.
 * The pointer is fixed at the top. Rotating the wheel by `rotation` degrees
 * clockwise brings the segment that originally sat at `360 - rotation` under it.
 */

export interface Segment {
  name: string;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  color: string;
}

/** Warm niceshops-inspired orange palette (lightest → deepest). */
export const PALETTE = [
  "#FFB23E",
  "#F39200",
  "#E8620E",
  "#FF8A3D",
  "#D45500",
  "#FFA726",
];

export function segmentAngle(count: number): number {
  if (count <= 0) return 360;
  return 360 / count;
}

/**
 * Cycle the palette, but never let a slice share a colour with the slice before
 * it — including the wrap-around from the last slice back to the first. With a
 * palette of 3+ colours a non-clashing choice always exists.
 */
export function segmentColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const prev = colors[i - 1];
    const wrapsToFirst = i === count - 1;
    const clashes = (c: string) => c === prev || (wrapsToFirst && c === colors[0]);

    let color = PALETTE[i % PALETTE.length];
    if (clashes(color)) color = PALETTE.find((c) => !clashes(c)) ?? color;
    colors.push(color);
  }
  return colors;
}

export function buildSegments(names: string[]): Segment[] {
  const slice = segmentAngle(names.length);
  const colors = segmentColors(names.length);
  return names.map((name, i) => {
    const startAngle = i * slice;
    const endAngle = startAngle + slice;
    return {
      name,
      startAngle,
      endAngle,
      midAngle: startAngle + slice / 2,
      color: colors[i],
    };
  });
}

function mod360(value: number): number {
  return ((value % 360) + 360) % 360;
}

/** Which segment index sits under the top pointer for a given rotation. */
export function winnerIndexForRotation(count: number, rotation: number): number {
  if (count <= 0) return 0;
  const slice = segmentAngle(count);
  const underPointer = mod360(360 - mod360(rotation));
  return Math.floor(underPointer / slice) % count;
}

/**
 * The total rotation that lands `index` under the pointer, spinning forward at
 * least `spins` full turns past the current rotation. The winner's slice centre
 * ends up aligned with the pointer.
 */
export function rotationForWinner(
  index: number,
  count: number,
  currentRotation: number,
  spins: number,
): number {
  const slice = segmentAngle(count);
  const targetUnderPointer = index * slice + slice / 2;
  const base = mod360(360 - targetUnderPointer);
  const delta = mod360(base - mod360(currentRotation));
  return currentRotation + spins * 360 + delta;
}

/** Pick a winner index from an injectable random source (defaults to Math.random). */
export function pickWinnerIndex(count: number, random: () => number): number {
  return Math.min(count - 1, Math.floor(random() * count));
}
