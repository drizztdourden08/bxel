/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { drawShape } from '../../packages/raster/src/index';
import type { ShapeOptions } from '../../packages/raster/src/index';
import { blankBuffer } from './blank-buffer';
import { maskFromRows } from './mask-from-rows';
import { toRows } from './to-rows';

describe('shapes with a brush', () => {
  test('a rectangle outline is stamped with a square brush', () => {
    const target = blankBuffer(9, 7);
    const rect = drawShape({ target, shape: 'rect', from: { x: 1, y: 1 }, to: { x: 7, y: 5 }, index: 1, brush: { shape: 'square', size: 2 } });
    expect(toRows(target)).toEqual(['.........', '.11111111', '.11111111', '.11....11', '.11....11', '.11111111', '.11111111']);
    expect(rect).toEqual({ x: 1, y: 1, width: 8, height: 6 });
  });

  test('a line is stamped with a circle brush', () => {
    const target = blankBuffer(6, 3);
    drawShape({ target, shape: 'line', from: { x: 1, y: 1 }, to: { x: 4, y: 1 }, index: 1, brush: { shape: 'circle', size: 3 } });
    expect(toRows(target)).toEqual(['.1111.', '111111', '.1111.']);
  });

  test('a filled shape is the exact region and ignores the brush', () => {
    const plain = blankBuffer(8, 8);
    const brushed = blankBuffer(8, 8);
    const corners = { from: { x: 2, y: 2 }, to: { x: 5, y: 4 } };
    drawShape({ target: plain, shape: 'rect', filled: true, index: 1, ...corners });
    drawShape({ target: brushed, shape: 'rect', filled: true, index: 1, brush: { shape: 'circle', size: 5 }, ...corners });
    expect(toRows(brushed)).toEqual(toRows(plain));
  });

  test('a filled line is still a line', () => {
    const target = blankBuffer(5, 3);
    drawShape({ target, shape: 'line', filled: true, from: { x: 0, y: 0 }, to: { x: 4, y: 2 }, index: 1 });
    expect(toRows(target)).toEqual(['1....', '.11..', '...11']);
  });
});

describe('shapes with symmetry', () => {
  test('a rectangle outline mirrors across a grid line', () => {
    const target = blankBuffer(8, 5);
    const rect = drawShape({ target, shape: 'rect', from: { x: 0, y: 1 }, to: { x: 2, y: 3 }, index: 1, symmetry: { x2: 8 } });
    expect(toRows(target)).toEqual(['........', '111..111', '1.1..1.1', '111..111', '........']);
    expect(rect).toEqual({ x: 0, y: 1, width: 8, height: 3 });
  });

  test('a filled ellipse mirrors across both axes', () => {
    const target = blankBuffer(8, 8);
    drawShape({ target, shape: 'ellipse', filled: true, from: { x: 0, y: 0 }, to: { x: 3, y: 2 }, index: 1, symmetry: { x2: 8, y2: 8 } });
    expect(toRows(target)).toEqual(['.11..11.', '11111111', '.11..11.', '........', '........', '.11..11.', '11111111', '.11..11.']);
  });

  test('an even brush on a mirrored line mirrors exactly', () => {
    const target = blankBuffer(8, 4);
    drawShape({ target, shape: 'line', from: { x: 0, y: 0 }, to: { x: 3, y: 1 }, index: 1, brush: { shape: 'square', size: 2 }, symmetry: { x2: 8 } });
    expect(toRows(target)).toEqual(['111..111', '11111111', '..1111..', '........']);
  });
});

describe('shapes with a mask and repeatable output', () => {
  test('a mask cuts a filled shape', () => {
    const target = blankBuffer(4, 3);
    const mask = maskFromRows(['#.##', '#.##', '#.##']);
    drawShape({ target, shape: 'rect', filled: true, from: { x: 0, y: 0 }, to: { x: 3, y: 2 }, index: 1, mask });
    expect(toRows(target)).toEqual(['1.11', '1.11', '1.11']);
  });

  test('the same request gives the same pixels and the same changed rectangle each time', () => {
    const request: Omit<ShapeOptions, 'target'> = { shape: 'ellipse', from: { x: 1, y: 1 }, to: { x: 10, y: 6 }, index: 4, filled: true };
    const preview = blankBuffer(12, 8);
    const commit = blankBuffer(12, 8);
    expect(drawShape({ target: preview, ...request })).toEqual(drawShape({ target: commit, ...request }));
    expect(toRows(preview)).toEqual(toRows(commit));
  });

  test('a shape wholly outside the buffer reports no change', () => {
    const target = blankBuffer(4, 4);
    expect(drawShape({ target, shape: 'ellipse', from: { x: 8, y: 8 }, to: { x: 12, y: 12 }, index: 1 })).toBeNull();
  });
});
