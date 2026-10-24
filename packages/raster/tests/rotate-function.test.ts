/* @layer tests @kind test */
import { fullMask, landRegion, rotateMover, rotatedBox, transformBuffer } from '@bxel/raster';
import type { BufferView, Orientation } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { fromRows } from './from-rows';
import { maskFromRows } from './mask-from-rows';
import { toRows } from './to-rows';

const SQUARE = ['1234', '5612', '3456', '1234'];

const rotated = (source: BufferView, degrees: number, pivot = { x2: source.width, y2: source.height }): BufferView => {
  const target = { pixels: source.pixels.slice(), width: source.width, height: source.height };
  const mask = fullMask(source);
  const box = { x: 0, y: 0, width: source.width, height: source.height };
  landRegion({ target, mask, resample: rotateMover(degrees)({ mask, box, pivot }), skipZero: false });
  return target;
};

describe('rotateMover at right angles', () => {
  test.each([
    [90, 'turn-clockwise'],
    [180, 'half-turn'],
    [270, 'turn-counter-clockwise'],
    [-90, 'turn-counter-clockwise'],
    [-270, 'turn-clockwise'],
    [450, 'turn-clockwise'],
  ] as const)('%i degrees equals the lossless %s', (degrees, orientation: Orientation) => {
    const source = fromRows(SQUARE);
    expect(toRows(rotated(source, degrees))).toEqual(toRows(transformBuffer(source, orientation)));
  });

  test('zero degrees changes nothing', () => {
    expect(toRows(rotated(fromRows(SQUARE), 0))).toEqual(SQUARE);
  });

  test('four quarter turns restore the pixels', () => {
    let current = fromRows(SQUARE);
    for (let turn = 0; turn < 4; turn++) current = rotated(current, 90);
    expect(toRows(current)).toEqual(SQUARE);
  });

  test('a non square block lands in the box the rotated corners give', () => {
    const mask = maskFromRows(['........', '........', '........', '######..', '######..', '........', '........', '........']);
    const box = { x: 0, y: 3, width: 6, height: 2 };
    const pivot = { x2: 6, y2: 8 };
    expect(rotatedBox(box, pivot, { cos: 0, sin: 1 })).toEqual({ x: 2, y: 1, width: 2, height: 6 });
    const target = fromRows(['........', '........', '........', '123456..', '654321..', '........', '........', '........']);
    landRegion({ target, mask, resample: rotateMover(90)({ mask, box, pivot }), skipZero: false });
    expect(toRows(target)).toEqual(['........', '..61....', '..52....', '..43....', '..34....', '..25....', '..16....', '........']);
  });
});

describe('rotateMover at other angles', () => {
  test('45 degrees turns a block into a diamond', () => {
    const block = fromRows(['.......', '.......', '..111..', '..111..', '..111..', '.......', '.......']);
    expect(toRows(rotated(block, 45))).toEqual(['.......', '...1...', '..111..', '.11111.', '..111..', '...1...', '.......']);
  });

  test('the rotation is clockwise for a positive angle', () => {
    const arm = fromRows(['.....', '.....', '..111', '.....', '.....']);
    expect(toRows(rotated(arm, 90, { x2: 5, y2: 5 }))).toEqual(['.....', '.....', '..1..', '..1..', '..1..']);
  });

  test('the box of 45 degrees comes from the rotated corners', () => {
    const terms = { cos: Math.SQRT1_2, sin: Math.SQRT1_2 };
    expect(rotatedBox({ x: 0, y: 0, width: 4, height: 4 }, { x2: 4, y2: 4 }, terms)).toEqual({ x: -1, y: -1, width: 6, height: 6 });
  });

  test('the same input always lands the same pixels', () => {
    const block = fromRows(['.......', '..111..', '..121..', '..111..', '.......', '.......', '.......']);
    expect(toRows(rotated(block, 33))).toEqual(toRows(rotated(block, 33)));
  });
});
