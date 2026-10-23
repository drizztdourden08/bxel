/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { drawShape } from '@bxel/raster';
import type { BufferView } from '@bxel/raster';
import { blankBuffer } from './blank-buffer';
import { toRows } from './to-rows';

type EllipseCase = { readonly size: readonly [number, number]; readonly outline: readonly string[]; readonly filled: readonly string[] };

const CASES: readonly EllipseCase[] = [
  { size: [1, 1], outline: ['1'], filled: ['1'] },
  { size: [2, 2], outline: ['11', '11'], filled: ['11', '11'] },
  { size: [3, 3], outline: ['.1.', '1.1', '.1.'], filled: ['.1.', '111', '.1.'] },
  { size: [1, 5], outline: ['1', '1', '1', '1', '1'], filled: ['1', '1', '1', '1', '1'] },
  { size: [5, 1], outline: ['11111'], filled: ['11111'] },
  { size: [5, 5], outline: ['.111.', '1...1', '1...1', '1...1', '.111.'], filled: ['.111.', '11111', '11111', '11111', '.111.'] },
  { size: [6, 6], outline: ['..11..', '.1..1.', '1....1', '1....1', '.1..1.', '..11..'], filled: ['..11..', '.1111.', '111111', '111111', '.1111.', '..11..'] },
  { size: [7, 5], outline: ['..111..', '.1...1.', '1.....1', '.1...1.', '..111..'], filled: ['..111..', '.11111.', '1111111', '.11111.', '..111..'] },
  { size: [8, 5], outline: ['..1111..', '.1....1.', '1......1', '.1....1.', '..1111..'], filled: ['..1111..', '.111111.', '11111111', '.111111.', '..1111..'] },
  { size: [9, 4], outline: ['..11111..', '11.....11', '11.....11', '..11111..'], filled: ['..11111..', '111111111', '111111111', '..11111..'] },
];

const draw = (width: number, height: number, filled: boolean): BufferView => {
  const target = blankBuffer(width, height);
  drawShape({ target, shape: 'ellipse', filled, from: { x: 0, y: 0 }, to: { x: width - 1, y: height - 1 }, index: 1 });
  return target;
};

const covers = (view: BufferView, axis: 'row' | 'column'): boolean => {
  const count = axis === 'row' ? view.height : view.width;
  for (let line = 0; line < count; line++) {
    const cells = axis === 'row' ? view.pixels.subarray(line * view.width, (line + 1) * view.width) : view.pixels.filter((_, i) => i % view.width === line);
    if (!cells.some((value) => value !== 0)) {
      return false;
    }
  }
  return true;
};

describe('ellipses', () => {
  test.each(CASES)('$size outline matches the golden rows', ({ size, outline }) => {
    expect(toRows(draw(size[0], size[1], false))).toEqual(outline);
  });

  test.each(CASES)('$size filled matches the golden rows', ({ size, filled }) => {
    expect(toRows(draw(size[0], size[1], true))).toEqual(filled);
  });

  test('every size up to 24 by 24 touches all four sides of its box', () => {
    for (let width = 1; width <= 24; width++) {
      for (let height = 1; height <= 24; height++) {
        const view = draw(width, height, false);
        expect(covers(view, 'row') && covers(view, 'column')).toBe(true);
      }
    }
  });

  test('every size up to 24 by 24 is symmetric across both axes, odd or even', () => {
    for (let width = 1; width <= 24; width++) {
      for (let height = 1; height <= 24; height++) {
        const rows = toRows(draw(width, height, true));
        expect(rows).toEqual(rows.map((row) => [...row].reverse().join('')));
        expect(rows).toEqual([...rows].reverse());
      }
    }
  });

  test('the same ellipse is drawn wherever the corners are given from', () => {
    const forward = blankBuffer(12, 12);
    const backward = blankBuffer(12, 12);
    drawShape({ target: forward, shape: 'ellipse', from: { x: 2, y: 3 }, to: { x: 9, y: 8 }, index: 1 });
    drawShape({ target: backward, shape: 'ellipse', from: { x: 9, y: 8 }, to: { x: 2, y: 3 }, index: 1 });
    expect(toRows(backward)).toEqual(toRows(forward));
  });

  test('moving the corners moves the same pixels', () => {
    const origin = toRows(draw(7, 6, false));
    const moved = blankBuffer(10, 9);
    drawShape({ target: moved, shape: 'ellipse', from: { x: 3, y: 2 }, to: { x: 9, y: 7 }, index: 1 });
    expect(toRows(moved).slice(2, 8).map((row) => row.slice(3))).toEqual(origin);
  });

  test('the changed rectangle is the box of the ellipse', () => {
    const target = blankBuffer(12, 12);
    const rect = drawShape({ target, shape: 'ellipse', filled: true, from: { x: 2, y: 3 }, to: { x: 9, y: 8 }, index: 1 });
    expect(rect).toEqual({ x: 2, y: 3, width: 8, height: 6 });
  });
});
