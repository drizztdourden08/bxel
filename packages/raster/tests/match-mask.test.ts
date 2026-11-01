/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { matchMask, wandMask } from '@bxel/raster';
import { fromRows } from './from-rows';
import { maskFromRows } from './mask-from-rows';
import { maskRows } from './mask-rows';

const SAME = (seed: number, index: number): boolean => seed === index;
const NEAR = (seed: number, index: number): boolean => Math.abs(seed - index) <= 1;

const PICTURE = fromRows(['11.2', '1..2', '.1.2', '..22']);

describe('matchMask', () => {
  test('with an exact rule it equals the wand', () => {
    const wand = wandMask({ target: PICTURE, seed: { x: 2, y: 0 }, connectivity: 4 });
    const match = matchMask({ target: PICTURE, seed: { x: 2, y: 0 }, contiguous: true, connectivity: 4, matches: SAME });
    expect(maskRows(match)).toEqual(maskRows(wand));
  });

  test('a rule that accepts near indices grows the region', () => {
    const match = matchMask({ target: PICTURE, seed: { x: 0, y: 0 }, contiguous: true, connectivity: 4, matches: NEAR });
    expect(maskRows(match)).toEqual(['####', '####', '####', '####']);
  });

  test('not contiguous takes every matching pixel of the picture', () => {
    const match = matchMask({ target: PICTURE, seed: { x: 0, y: 0 }, contiguous: false, connectivity: 4, matches: SAME });
    expect(maskRows(match)).toEqual(['##..', '#...', '.#..', '....']);
  });

  test('ignore leaves out the transparent index even when it matches', () => {
    const match = matchMask({ target: PICTURE, seed: { x: 2, y: 0 }, contiguous: false, connectivity: 4, matches: SAME, ignore: (index) => index === 0 });
    expect(maskRows(match)).toEqual(['....', '....', '....', '....']);
  });

  test('within keeps the result inside the given mask', () => {
    const within = maskFromRows(['#...', '#...', '....', '....']);
    const match = matchMask({ target: PICTURE, seed: { x: 0, y: 0 }, contiguous: false, connectivity: 4, matches: SAME, within });
    expect(maskRows(match)).toEqual(['#...', '#...', '....', '....']);
  });

  test('seedIndex stands in for the pixel under the seed', () => {
    const match = matchMask({ target: PICTURE, seed: { x: 0, y: 0 }, seedIndex: 2, contiguous: false, connectivity: 4, matches: SAME });
    expect(maskRows(match)).toEqual(['...#', '...#', '...#', '..##']);
  });

  test('a seed outside the picture gives an empty mask', () => {
    const match = matchMask({ target: PICTURE, seed: { x: 9, y: 9 }, contiguous: true, connectivity: 4, matches: SAME });
    expect(maskRows(match)).toEqual(['....', '....', '....', '....']);
  });
});
