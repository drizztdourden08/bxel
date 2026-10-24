/* @layer tests @kind test */
import { trimRgba, untrimRgba } from '@bxel/formats';
import type { RgbaImage } from '@bxel/formats';
import { describe, expect, it } from 'vitest';

const sparse = (width: number, height: number, points: readonly (readonly [number, number])[]): RgbaImage => {
  const data = new Uint8ClampedArray(width * height * 4);
  points.forEach(([x, y], i) => data.set([10 + i, 20, 30, 255 - i], (y * width + x) * 4));
  return { data, width, height };
};

describe('trim and untrim', () => {
  it('crops transparent borders and remembers the offset', () => {
    const image = sparse(10, 8, [
      [3, 2],
      [6, 5],
    ]);
    const trimmed = trimRgba(image);
    expect([trimmed.image.width, trimmed.image.height]).toEqual([4, 4]);
    expect([trimmed.offsetX, trimmed.offsetY]).toEqual([3, 2]);
    expect([trimmed.sourceWidth, trimmed.sourceHeight]).toEqual([10, 8]);
    expect(Array.from(trimmed.image.data.subarray(0, 4))).toEqual([10, 20, 30, 255]);
  });

  it.each([
    [[[0, 0]]],
    [[[9, 7]]],
    [[[0, 7], [9, 0]]],
    [[[4, 4], [5, 4], [4, 5]]],
  ] as const)('untrim restores the exact source for %j', (points) => {
    const image = sparse(10, 8, points);
    const restored = untrimRgba(trimRgba(image));
    expect(restored.width).toBe(10);
    expect(restored.height).toBe(8);
    expect(Array.from(restored.data)).toEqual(Array.from(image.data));
  });

  it('keeps an untouched image whole', () => {
    const image = sparse(2, 2, [
      [0, 0],
      [1, 1],
    ]);
    const trimmed = trimRgba(image);
    expect([trimmed.image.width, trimmed.image.height, trimmed.offsetX, trimmed.offsetY]).toEqual([2, 2, 0, 0]);
  });

  it('reduces a fully transparent image to one transparent pixel', () => {
    const trimmed = trimRgba(sparse(5, 5, []));
    expect([trimmed.image.width, trimmed.image.height]).toEqual([1, 1]);
    expect(Array.from(untrimRgba(trimmed).data).every((value) => value === 0)).toBe(true);
  });
});
