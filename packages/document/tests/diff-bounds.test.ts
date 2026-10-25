/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { diffBounds, hasIndexAtLeast, maxIndex, remapCel } from '@bxel/document';

const LCG_MULTIPLIER = 1664525;
const LCG_INCREMENT = 1013904223;
const LCG_RANGE = 4294967296;

const seeded = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state = (state * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_RANGE;
    return state / LCG_RANGE;
  };
};

const naiveBounds = (before: Uint8Array, after: Uint8Array, width: number) => {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = -1;
  let maxY = -1;
  for (const [index, value] of after.entries()) {
    if (value === before[index]) continue;
    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return maxX < 0 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
};

const SHAPES = [
  [1, 1],
  [3, 5],
  [4, 4],
  [7, 9],
  [13, 3],
  [16, 16],
  [31, 17],
  [64, 8],
  [100, 37],
] as const;

describe('diffBounds', () => {
  test('matches a byte by byte scan for random edits on odd and even sizes', () => {
    const next = seeded(7);
    for (const [width, height] of SHAPES) {
      for (let round = 0; round < 60; round += 1) {
        const before = Uint8Array.from({ length: width * height }, () => Math.floor(next() * 4));
        const after = before.slice();
        const edits = Math.floor(next() * 4);
        for (let edit = 0; edit < edits; edit += 1) after[Math.floor(next() * after.length)] = 9 + edit;
        expect(diffBounds(before, after, width)).toEqual(naiveBounds(before, after, width));
      }
    }
  });

  test('matches a byte by byte scan on views that start off a word boundary', () => {
    const next = seeded(11);
    const width = 10;
    const backing = new Uint8Array(200).map(() => Math.floor(next() * 3));
    for (let shift = 0; shift < 4; shift += 1) {
      const before = backing.subarray(shift, shift + 100);
      const after = before.slice();
      after[37] = 8;
      after[71] = 9;
      expect(diffBounds(before, after, width)).toEqual(naiveBounds(before, after, width));
    }
  });

  test('reports nothing for equal buffers and the whole sprite for a total change', () => {
    const base = new Uint8Array(35);
    expect(diffBounds(base, base.slice(), 7)).toBeNull();
    expect(diffBounds(base, base.map(() => 1), 7)).toEqual({ x: 0, y: 0, width: 7, height: 5 });
  });
});

describe('hasIndexAtLeast', () => {
  test('agrees with maxIndex for every limit', () => {
    const next = seeded(3);
    for (let round = 0; round < 80; round += 1) {
      const length = 1 + Math.floor(next() * 90);
      const ceiling = 1 + Math.floor(next() * 255);
      const pixels = Uint8Array.from({ length }, () => Math.floor(next() * ceiling));
      for (const limit of [0, 1, 2, 5, 16, 127, 128, 129, 200, 255, 256]) {
        expect(hasIndexAtLeast(pixels, limit)).toBe(maxIndex(pixels) >= limit);
      }
    }
  });
});

describe('remapCel', () => {
  test('maps every value through the table and sends unknown values to zero', () => {
    const table = Uint8Array.from([0, 3, 2, 1]);
    const pixels = Uint8Array.from([0, 1, 2, 3, 4, 200, 255, 1]);
    expect(Array.from(remapCel(pixels, table))).toEqual([0, 3, 2, 1, 0, 0, 0, 3]);
  });
});
