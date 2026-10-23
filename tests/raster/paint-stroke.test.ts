/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { paintStroke } from '../../packages/raster/src/index';
import type { Brush, Point } from '../../packages/raster/src/index';
import { blankBuffer } from './blank-buffer';
import { fromRows } from './from-rows';
import { maskFromRows } from './mask-from-rows';
import { toRows } from './to-rows';

const at = (x: number, y: number): Point => ({ x, y });
const PIXEL: Brush = { shape: 'square', size: 1 };

describe('stroke compositor', () => {
  test('a circle brush stamps along an interpolated stroke', () => {
    const target = blankBuffer(7, 5);
    const rect = paintStroke({ target, points: [at(1, 2), at(5, 2)], index: 3, brush: { shape: 'circle', size: 3 } });
    expect(toRows(target)).toEqual(['.......', '.33333.', '3333333', '.33333.', '.......']);
    expect(rect).toEqual({ x: 0, y: 1, width: 7, height: 3 });
  });

  test('a brush that leaves the buffer is clipped', () => {
    const target = blankBuffer(7, 5);
    const rect = paintStroke({ target, points: [at(0, 0), at(6, 0)], index: 3, brush: { shape: 'square', size: 3 } });
    expect(toRows(target)).toEqual(['3333333', '3333333', '.......', '.......', '.......']);
    expect(rect).toEqual({ x: 0, y: 0, width: 7, height: 2 });
  });

  test('a stroke that starts outside the buffer is clipped, not rejected', () => {
    const target = blankBuffer(4, 4);
    const rect = paintStroke({ target, points: [at(-3, -3), at(1, 1)], index: 1, brush: PIXEL });
    expect(toRows(target)).toEqual(['1...', '.1..', '....', '....']);
    expect(rect).toEqual({ x: 0, y: 0, width: 2, height: 2 });
  });

  test('an even brush covers the point and the pixels to its right and below', () => {
    const target = blankBuffer(5, 5);
    const rect = paintStroke({ target, points: [at(2, 2)], index: 1, brush: { shape: 'square', size: 2 } });
    expect(toRows(target)).toEqual(['.....', '.....', '..11.', '..11.', '.....']);
    expect(rect).toEqual({ x: 2, y: 2, width: 2, height: 2 });
  });

  test('erasing writes index 0', () => {
    const target = fromRows(['3333333', '3333333', '3333333']);
    const rect = paintStroke({ target, points: [at(1, 1), at(5, 1)], index: 0, brush: PIXEL });
    expect(toRows(target)).toEqual(['3333333', '3.....3', '3333333']);
    expect(rect).toEqual({ x: 1, y: 1, width: 5, height: 1 });
  });

  test('the changed rectangle covers only pixels whose value changed', () => {
    const target = fromRows(['3333...']);
    const rect = paintStroke({ target, points: [at(0, 0), at(6, 0)], index: 3, brush: PIXEL });
    expect(rect).toEqual({ x: 4, y: 0, width: 3, height: 1 });
  });

  test('painting what is already there reports no change', () => {
    const target = fromRows(['.....']);
    expect(paintStroke({ target, points: [at(1, 0), at(3, 0)], index: 0, brush: PIXEL })).toBeNull();
    paintStroke({ target, points: [at(1, 0), at(3, 0)], index: 2, brush: PIXEL });
    expect(paintStroke({ target, points: [at(1, 0), at(3, 0)], index: 2, brush: PIXEL })).toBeNull();
  });

  test('no points paint nothing', () => {
    const target = blankBuffer(3, 3);
    expect(paintStroke({ target, points: [], index: 1, brush: PIXEL })).toBeNull();
  });

  test('a mask limits the stroke', () => {
    const target = fromRows(['3333333', '3333333', '3333333']);
    const mask = maskFromRows(['..###..', '..###..', '..###..']);
    const rect = paintStroke({ target, points: [at(0, 1), at(6, 1)], index: 5, brush: PIXEL, mask });
    expect(toRows(target)).toEqual(['3333333', '3355533', '3333333']);
    expect(rect).toEqual({ x: 2, y: 1, width: 3, height: 1 });
  });

  test('a mask that excludes everything leaves the buffer alone', () => {
    const target = blankBuffer(3, 3);
    const mask = maskFromRows(['...', '...', '...']);
    expect(paintStroke({ target, points: [at(0, 0), at(2, 2)], index: 1, brush: PIXEL, mask })).toBeNull();
    expect(toRows(target)).toEqual(['...', '...', '...']);
  });
});

describe('pixel perfect strokes', () => {
  test('the corner pixel of an L is dropped when asked', () => {
    const target = blankBuffer(5, 5);
    const rect = paintStroke({ target, points: [at(0, 0), at(4, 0), at(4, 4)], index: 1, brush: PIXEL, pixelPerfect: true });
    expect(toRows(target)).toEqual(['1111.', '....1', '....1', '....1', '....1']);
    expect(rect).toEqual({ x: 0, y: 0, width: 5, height: 5 });
  });

  test('the corner stays by default', () => {
    const target = blankBuffer(5, 5);
    paintStroke({ target, points: [at(0, 0), at(4, 0), at(4, 4)], index: 1, brush: PIXEL });
    expect(toRows(target)).toEqual(['11111', '....1', '....1', '....1', '....1']);
  });

  test('a freehand staircase becomes a clean diagonal', () => {
    const target = blankBuffer(4, 3);
    const points = [at(0, 0), at(1, 0), at(1, 1), at(2, 1), at(2, 2), at(3, 2)];
    paintStroke({ target, points, index: 1, brush: PIXEL, pixelPerfect: true });
    expect(toRows(target)).toEqual(['1...', '.1..', '..11']);
  });

  test('mirrored strokes are filtered the same way as the original', () => {
    const target = blankBuffer(8, 3);
    const points = [at(0, 0), at(1, 0), at(1, 1), at(2, 1), at(2, 2), at(3, 2)];
    paintStroke({ target, points, index: 1, brush: PIXEL, pixelPerfect: true, symmetry: { x2: 8 } });
    expect(toRows(target)).toEqual(['1......1', '.1....1.', '..1111..']);
  });
});

describe('long strokes', () => {
  test('the largest point list paints without error', () => {
    const target = blankBuffer(256, 256);
    const points = Array.from({ length: 8192 }, (_, i) => at((i * 7) % 256, (i * 13) % 256));
    const rect = paintStroke({ target, points, index: 2, brush: { shape: 'circle', size: 4 } });
    expect(rect).not.toBeNull();
  });
});
