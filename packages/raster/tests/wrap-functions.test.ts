/* @layer tests @kind test */
import { drawShape, floodFill, foldPoint, paintStroke } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { blankBuffer } from './blank-buffer';
import { fromRows } from './from-rows';
import { toRows } from './to-rows';

const BRUSH = { shape: 'square', size: 1 } as const;
const BOTH = { x: true, y: true };
const CONTIGUOUS = { mode: 'contiguous', index: 2 } as const;

const inkOf = (rows: readonly string[]): number => rows.join('').replaceAll('.', '').length;

describe('wrapped painting', () => {
  test('folds a point into the sprite on the wrapped axes only', () => {
    const room = { width: 4, height: 3 };
    expect(foldPoint({ x: -1, y: 5 }, room, { x: true })).toEqual({ x: 3, y: 5 });
    expect(foldPoint({ x: 9, y: -1 }, room, BOTH)).toEqual({ x: 1, y: 2 });
    expect(foldPoint({ x: 9, y: -1 }, room, undefined)).toEqual({ x: 9, y: -1 });
  });

  test('a stroke that leaves the right edge continues from the left edge', () => {
    const target = blankBuffer(5, 3);
    const points = [{ x: 3, y: 1 }, { x: 6, y: 1 }];
    const rect = paintStroke({ target, index: 1, points, brush: BRUSH, wrap: { x: true } });
    expect(toRows(target)).toEqual(['.....', '11.11', '.....']);
    expect(rect).toEqual({ x: 0, y: 1, width: 5, height: 1 });
  });

  test('a stroke that leaves the left edge continues from the right edge', () => {
    const target = blankBuffer(5, 1);
    paintStroke({ target, index: 1, points: [{ x: 1, y: 0 }, { x: -1, y: 0 }], brush: BRUSH, wrap: { x: true } });
    expect(toRows(target)).toEqual(['11..1']);
  });

  test('the same stroke is clipped at the edge without wrap', () => {
    const target = blankBuffer(5, 3);
    paintStroke({ target, index: 1, points: [{ x: 3, y: 1 }, { x: 7, y: 1 }], brush: BRUSH });
    expect(toRows(target)[1]).toBe('...11');
  });

  test('wrapping one axis leaves the other clipped', () => {
    const target = blankBuffer(3, 3);
    paintStroke({ target, index: 1, points: [{ x: 1, y: 2 }, { x: 1, y: 4 }], brush: BRUSH, wrap: { x: true } });
    expect(toRows(target)).toEqual(['...', '...', '.1.']);
  });

  test('a diagonal stroke wraps on both axes', () => {
    const target = blankBuffer(4, 4);
    paintStroke({ target, index: 2, points: [{ x: 2, y: 2 }, { x: 5, y: 5 }], brush: BRUSH, wrap: BOTH });
    expect(toRows(target)).toEqual(['2...', '.2..', '..2.', '...2']);
  });

  test('a wide brush spills over the opposite edge', () => {
    const target = blankBuffer(6, 3);
    paintStroke({ target, index: 1, points: [{ x: 0, y: 1 }], brush: { shape: 'square', size: 3 }, wrap: BOTH });
    expect(toRows(target)).toEqual(['11...1', '11...1', '11...1']);
  });

  test('a line crossing the bottom edge wraps to the top', () => {
    const target = blankBuffer(3, 4);
    drawShape({ target, index: 1, shape: 'line', from: { x: 1, y: 2 }, to: { x: 1, y: 5 }, wrap: { y: true } });
    expect(toRows(target)).toEqual(['.1.', '.1.', '.1.', '.1.']);
  });

  test('a filled rectangle that sticks out of the right edge reappears on the left', () => {
    const target = blankBuffer(5, 3);
    drawShape({ target, index: 3, shape: 'rect', filled: true, from: { x: 3, y: 0 }, to: { x: 6, y: 1 }, wrap: { x: true } });
    expect(toRows(target)).toEqual(['33.33', '33.33', '.....']);
  });

  test('a rectangle outline wraps its far side', () => {
    const target = blankBuffer(5, 5);
    drawShape({ target, index: 1, shape: 'rect', from: { x: 3, y: 1 }, to: { x: 6, y: 3 }, wrap: { x: true } });
    expect(toRows(target)).toEqual(['.....', '11.11', '.1.1.', '11.11', '.....']);
  });

  test('an ellipse keeps its far half with wrap and loses it without', () => {
    const clipped = blankBuffer(6, 6);
    const kept = blankBuffer(6, 6);
    const corners = { from: { x: -2, y: 1 }, to: { x: 2, y: 4 } };
    drawShape({ target: clipped, index: 1, shape: 'ellipse', ...corners });
    drawShape({ target: kept, index: 1, shape: 'ellipse', ...corners, wrap: { x: true } });
    expect(inkOf(toRows(kept))).toBeGreaterThan(inkOf(toRows(clipped)));
  });

  test('a fill crosses the seam to reach the far columns', () => {
    const plain = fromRows(['..1..']);
    const wrapped = fromRows(['..1..']);
    floodFill({ target: plain, seed: { x: 0, y: 0 }, ...CONTIGUOUS });
    floodFill({ target: wrapped, seed: { x: 0, y: 0 }, ...CONTIGUOUS, wrap: { x: true } });
    expect(toRows(plain)).toEqual(['221..']);
    expect(toRows(wrapped)).toEqual(['22122']);
  });

  test('a fill stops at walls on both sides of the seam', () => {
    const target = fromRows(['1....1', '1....1']);
    const spread = floodFill({ target, seed: { x: 2, y: 0 }, index: 3, mode: 'contiguous', wrap: { x: true } });
    expect(toRows(target)).toEqual(['133331', '133331']);
    expect(spread).toEqual({ x: 1, y: 0, width: 4, height: 2 });
  });

  test('a fill crosses the top and bottom seam', () => {
    const target = fromRows(['.', '1', '.']);
    floodFill({ target, seed: { x: 0, y: 0 }, ...CONTIGUOUS, wrap: { y: true } });
    expect(toRows(target)).toEqual(['2', '1', '2']);
  });

  test('a seed outside the sprite is folded back inside', () => {
    const target = blankBuffer(3, 3);
    floodFill({ target, seed: { x: 4, y: -1 }, index: 1, mode: 'contiguous', wrap: BOTH });
    expect(toRows(target)).toEqual(['111', '111', '111']);
  });

  test('connectivity 8 steps across the seam diagonally and 4 does not', () => {
    const four = fromRows(['.11', '11.']);
    const eight = fromRows(['.11', '11.']);
    floodFill({ target: four, seed: { x: 0, y: 0 }, ...CONTIGUOUS, connectivity: 4, wrap: { x: true } });
    floodFill({ target: eight, seed: { x: 0, y: 0 }, ...CONTIGUOUS, connectivity: 8, wrap: { x: true } });
    expect(toRows(four)).toEqual(['211', '11.']);
    expect(toRows(eight)).toEqual(['211', '112']);
  });
});
