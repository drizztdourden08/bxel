/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { floodFill } from '@bxel/raster';
import { blankBuffer } from './blank-buffer';
import { fromRows } from './from-rows';
import { maskFromRows } from './mask-from-rows';
import { toRows } from './to-rows';

const COLUMN_WALL = maskFromRows(['###.###', '###.###', '###.###']);

describe('global fill', () => {
  test('replaces every pixel with the seed index, connected or not', () => {
    const target = fromRows(['..1..', '..1..', '..1..', '..1..', '..1..']);
    const rect = floodFill({ target, seed: { x: 0, y: 0 }, index: 2, mode: 'global' });
    expect(toRows(target)).toEqual(['22122', '22122', '22122', '22122', '22122']);
    expect(rect).toEqual({ x: 0, y: 0, width: 5, height: 5 });
  });

  test('matches the index of the seed exactly', () => {
    const target = fromRows(['.1.1.', '1.1.1', '.1.1.']);
    const rect = floodFill({ target, seed: { x: 1, y: 0 }, index: 2, mode: 'global' });
    expect(toRows(target)).toEqual(['.2.2.', '2.2.2', '.2.2.']);
    expect(rect).toEqual({ x: 0, y: 0, width: 5, height: 3 });
  });

  test('changed bounds cover only the pixels that matched', () => {
    const target = fromRows(['1.....', '......', '.....1']);
    const rect = floodFill({ target, seed: { x: 0, y: 0 }, index: 3, mode: 'global' });
    expect(rect).toEqual({ x: 0, y: 0, width: 6, height: 3 });
    const small = fromRows(['......', '.1..1.', '......']);
    expect(floodFill({ target: small, seed: { x: 1, y: 1 }, index: 3, mode: 'global' })).toEqual({ x: 1, y: 1, width: 4, height: 1 });
  });
});

describe('fill with a mask', () => {
  test('a global fill skips pixels outside the mask', () => {
    const target = fromRows(['.1.1.', '1.1.1', '.1.1.']);
    const mask = maskFromRows(['###..', '###..', '###..']);
    const rect = floodFill({ target, seed: { x: 0, y: 0 }, index: 2, mode: 'global', mask });
    expect(toRows(target)).toEqual(['2121.', '121.1', '2121.']);
    expect(rect).toEqual({ x: 0, y: 0, width: 3, height: 3 });
  });

  test('a contiguous fill stops at the mask edge', () => {
    const target = blankBuffer(5, 4);
    const mask = maskFromRows(['..###', '..###', '..###', '..###']);
    const rect = floodFill({ target, seed: { x: 3, y: 1 }, index: 4, mode: 'contiguous', mask });
    expect(toRows(target)).toEqual(['..444', '..444', '..444', '..444']);
    expect(rect).toEqual({ x: 2, y: 0, width: 3, height: 4 });
  });

  test.each([4, 8] as const)('a masked-out column splits one region in two, %i-way', (connectivity) => {
    const target = blankBuffer(7, 3);
    floodFill({ target, seed: { x: 0, y: 0 }, index: 5, mode: 'contiguous', connectivity, mask: COLUMN_WALL });
    expect(toRows(target)).toEqual(['555....', '555....', '555....']);
  });

  test('a masked-out column does not stop a global fill from reaching the far side', () => {
    const target = blankBuffer(7, 3);
    floodFill({ target, seed: { x: 0, y: 0 }, index: 5, mode: 'global', mask: COLUMN_WALL });
    expect(toRows(target)).toEqual(['555.555', '555.555', '555.555']);
  });

  test('a seed outside the mask changes nothing', () => {
    const target = blankBuffer(5, 4);
    const mask = maskFromRows(['..###', '..###', '..###', '..###']);
    expect(floodFill({ target, seed: { x: 0, y: 0 }, index: 4, mode: 'contiguous', mask })).toBeNull();
    expect(floodFill({ target, seed: { x: 0, y: 0 }, index: 4, mode: 'global', mask })).toBeNull();
    expect(target.pixels.every((value) => value === 0)).toBe(true);
  });

  test('a mask smaller than the buffer treats the rest as outside', () => {
    const target = blankBuffer(5, 3);
    const mask = maskFromRows(['##', '##']);
    floodFill({ target, seed: { x: 0, y: 0 }, index: 6, mode: 'contiguous', mask });
    expect(toRows(target)).toEqual(['66...', '66...', '.....']);
  });
});

describe('fill edge cases', () => {
  test('a seed outside the buffer changes nothing', () => {
    const target = blankBuffer(4, 4);
    expect(floodFill({ target, seed: { x: 9, y: 9 }, index: 1, mode: 'contiguous' })).toBeNull();
    expect(floodFill({ target, seed: { x: -1, y: 0 }, index: 1, mode: 'global' })).toBeNull();
  });

  test('filling with the index already under the seed changes nothing', () => {
    const target = fromRows(['33', '33']);
    expect(floodFill({ target, seed: { x: 0, y: 0 }, index: 3, mode: 'contiguous' })).toBeNull();
    expect(floodFill({ target, seed: { x: 1, y: 1 }, index: 3, mode: 'global' })).toBeNull();
    expect(toRows(target)).toEqual(['33', '33']);
  });

  test('erasing with index 0 clears a region', () => {
    const target = fromRows(['111', '121', '111']);
    floodFill({ target, seed: { x: 0, y: 0 }, index: 0, mode: 'contiguous' });
    expect(toRows(target)).toEqual(['...', '.2.', '...']);
  });
});
