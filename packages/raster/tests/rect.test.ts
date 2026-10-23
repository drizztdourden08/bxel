/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { drawShape } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import { blankBuffer } from './blank-buffer';
import { toRows } from './to-rows';

type RectCase = {
  readonly name: string;
  readonly from: Point;
  readonly to: Point;
  readonly filled: boolean;
  readonly rows: readonly string[];
};

const CASES: readonly RectCase[] = [
  { name: 'even outline', from: { x: 1, y: 1 }, to: { x: 4, y: 2 }, filled: false, rows: ['......', '.1111.', '.1111.', '......', '......'] },
  { name: 'wide outline', from: { x: 1, y: 1 }, to: { x: 4, y: 3 }, filled: false, rows: ['......', '.1111.', '.1..1.', '.1111.', '......'] },
  { name: 'wide filled', from: { x: 1, y: 1 }, to: { x: 4, y: 3 }, filled: true, rows: ['......', '.1111.', '.1111.', '.1111.', '......'] },
  { name: 'corners given backwards', from: { x: 4, y: 3 }, to: { x: 1, y: 1 }, filled: false, rows: ['......', '.1111.', '.1..1.', '.1111.', '......'] },
  { name: 'corners given on the other diagonal', from: { x: 4, y: 1 }, to: { x: 1, y: 3 }, filled: false, rows: ['......', '.1111.', '.1..1.', '.1111.', '......'] },
  { name: 'odd outline', from: { x: 1, y: 1 }, to: { x: 3, y: 3 }, filled: false, rows: ['......', '.111..', '.1.1..', '.111..', '......'] },
  { name: 'odd filled', from: { x: 1, y: 1 }, to: { x: 3, y: 3 }, filled: true, rows: ['......', '.111..', '.111..', '.111..', '......'] },
  { name: 'full frame outline', from: { x: 0, y: 0 }, to: { x: 5, y: 4 }, filled: false, rows: ['111111', '1....1', '1....1', '1....1', '111111'] },
  { name: 'one pixel', from: { x: 2, y: 2 }, to: { x: 2, y: 2 }, filled: false, rows: ['......', '......', '..1...', '......', '......'] },
  { name: 'one row', from: { x: 1, y: 2 }, to: { x: 3, y: 2 }, filled: false, rows: ['......', '......', '.111..', '......', '......'] },
  { name: 'one column filled', from: { x: 2, y: 1 }, to: { x: 2, y: 3 }, filled: true, rows: ['......', '..1...', '..1...', '..1...', '......'] },
  { name: 'two by two outline has no hole', from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, filled: false, rows: ['......', '.11...', '.11...', '......', '......'] },
];

describe('rectangles', () => {
  test.each(CASES)('$name', ({ from, to, filled, rows }) => {
    const target = blankBuffer(6, 5);
    drawShape({ target, shape: 'rect', from, to, filled, index: 1 });
    expect(toRows(target)).toEqual(rows);
  });

  test('the changed rectangle is the bounding box of the shape', () => {
    const target = blankBuffer(6, 5);
    const rect = drawShape({ target, shape: 'rect', from: { x: 4, y: 3 }, to: { x: 1, y: 1 }, index: 1 });
    expect(rect).toEqual({ x: 1, y: 1, width: 4, height: 3 });
  });

  test('a rectangle that leaves the buffer is clipped', () => {
    const target = blankBuffer(6, 5);
    const rect = drawShape({ target, shape: 'rect', filled: true, from: { x: -3, y: -2 }, to: { x: 1, y: 1 }, index: 2 });
    expect(toRows(target)).toEqual(['22....', '22....', '......', '......', '......']);
    expect(rect).toEqual({ x: 0, y: 0, width: 2, height: 2 });
  });

  test('a rectangle fully outside changes nothing', () => {
    const target = blankBuffer(6, 5);
    expect(drawShape({ target, shape: 'rect', filled: true, from: { x: 10, y: 10 }, to: { x: 12, y: 12 }, index: 1 })).toBeNull();
  });
});
