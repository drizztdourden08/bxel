/* @layer tests @kind test */
import { bayerMatrix, gradientFill, gradientPosition } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { blankBuffer } from './blank-buffer';
import { maskFromRows } from './mask-from-rows';
import { toRows } from './to-rows';

const ORIGIN = { x: 0, y: 0 };
const ACROSS = { from: { x: 0, y: 0 }, to: { x: 7, y: 0 } };

describe('bayerMatrix', () => {
  test('builds the classic 2, 4 and 8 matrices', () => {
    expect([...bayerMatrix(2)]).toEqual([0, 2, 3, 1]);
    expect([...bayerMatrix(4)]).toEqual([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]);
    expect([...bayerMatrix(8).slice(0, 8)]).toEqual([0, 32, 8, 40, 2, 34, 10, 42]);
  });

  test('each matrix holds every rank exactly once', () => {
    for (const size of [2, 4, 8] as const) {
      expect([...bayerMatrix(size)].sort((a, b) => a - b)).toEqual(Array.from({ length: size * size }, (_, rank) => rank));
    }
  });
});

describe('gradientPosition', () => {
  test('projects onto the line and clamps at both ends', () => {
    expect(gradientPosition(ACROSS, 0, 3)).toBe(0);
    expect(gradientPosition(ACROSS, 7, 0)).toBe(1);
    expect(gradientPosition(ACROSS, 14, 0)).toBe(1);
    expect(gradientPosition(ACROSS, -3, 0)).toBe(0);
    expect(gradientPosition({ from: { x: 0, y: 0 }, to: { x: 0, y: 4 } }, 5, 2)).toBe(0.5);
  });
});

describe('gradientFill', () => {
  test('solid bands share the line evenly', () => {
    const target = blankBuffer(8, 1);
    gradientFill({ target, colors: [1, 2, 3], line: ACROSS, bayer: null, origin: ORIGIN });
    expect(toRows(target)).toEqual(['11122333']);
  });

  test('a vertical line makes horizontal bands', () => {
    const target = blankBuffer(2, 4);
    gradientFill({ target, colors: [4, 5], line: { from: { x: 0, y: 0 }, to: { x: 0, y: 3 } }, bayer: null, origin: ORIGIN });
    expect(toRows(target)).toEqual(['44', '44', '55', '55']);
  });

  test('ordered dither mixes the two colours a pixel sits between', () => {
    const target = blankBuffer(8, 1);
    gradientFill({ target, colors: [1, 2], line: ACROSS, bayer: 4, origin: ORIGIN });
    expect(toRows(target)).toEqual(['11212222']);
  });

  test('the pattern origin shifts the dither', () => {
    const first = blankBuffer(8, 1);
    const shifted = blankBuffer(8, 1);
    gradientFill({ target: first, colors: [1, 2], line: ACROSS, bayer: 4, origin: ORIGIN });
    gradientFill({ target: shifted, colors: [1, 2], line: ACROSS, bayer: 4, origin: { x: 1, y: 0 } });
    expect(toRows(shifted)).not.toEqual(toRows(first));
    expect(toRows(shifted)).toEqual(['12121222']);
  });

  test('dither rows differ from one another', () => {
    const target = blankBuffer(4, 4);
    gradientFill({ target, colors: [1, 2], line: { from: { x: 0, y: 0 }, to: { x: 0, y: 4 } }, bayer: 2, origin: ORIGIN });
    expect(toRows(target)).toEqual(['1111', '1111', '2121', '1212']);
  });

  test('stays inside the mask and reports the box it wrote', () => {
    const target = blankBuffer(8, 1);
    const rect = gradientFill({ target, mask: maskFromRows(['..####..']), colors: [1, 2, 3], line: ACROSS, bayer: null, origin: ORIGIN });
    expect(toRows(target)).toEqual(['..1223..']);
    expect(rect).toEqual({ x: 2, y: 0, width: 4, height: 1 });
  });

  test('colours run in the order given, so a reversed ramp reverses the bands', () => {
    const target = blankBuffer(8, 1);
    gradientFill({ target, colors: [3, 2, 1], line: ACROSS, bayer: null, origin: ORIGIN });
    expect(toRows(target)).toEqual(['33322111']);
  });
});
