/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { combineMasks, emptyMask, expandMask, fullMask, indexMask, invertMask, maskBounds, shrinkMask, wandMask } from '@bxel/raster';
import type { CombineMode } from '@bxel/raster';
import { fromRows } from './from-rows';
import { maskFromRows } from './mask-from-rows';
import { maskRows } from './mask-rows';

const DIAGONAL = fromRows(['1...', '.1..', '..1.', '1..1']);
const REGIONS = fromRows(['11.2', '1..2', '.1.2', '..22']);

describe('contiguous wand', () => {
  test('4-way sees a diagonal as separate pixels', () => {
    const mask = wandMask({ target: DIAGONAL, seed: { x: 0, y: 0 }, connectivity: 4 });
    expect(maskRows(mask)).toEqual(['#...', '....', '....', '....']);
  });

  test('8-way follows the diagonal', () => {
    const mask = wandMask({ target: DIAGONAL, seed: { x: 1, y: 1 }, connectivity: 8 });
    expect(maskRows(mask)).toEqual(['#...', '.#..', '..#.', '...#']);
  });

  test('matches the exact index and can start on the transparent index', () => {
    const mask = wandMask({ target: REGIONS, seed: { x: 2, y: 0 }, connectivity: 4 });
    expect(maskRows(mask)).toEqual(['..#.', '.##.', '..#.', '....']);
  });

  test('stops at other indices and never reads the source twice', () => {
    const before = REGIONS.pixels.slice();
    const mask = wandMask({ target: REGIONS, seed: { x: 3, y: 0 }, connectivity: 4 });
    expect(maskRows(mask)).toEqual(['...#', '...#', '...#', '..##']);
    expect(REGIONS.pixels).toEqual(before);
  });

  test('a seed outside the canvas selects nothing', () => {
    expect(wandMask({ target: REGIONS, seed: { x: 9, y: 0 }, connectivity: 8 })).toEqual(emptyMask(REGIONS));
    expect(wandMask({ target: REGIONS, seed: { x: 0, y: -1 }, connectivity: 8 })).toEqual(emptyMask(REGIONS));
  });
});

describe('all pixels of one index', () => {
  test('selects every pixel of the index, connected or not', () => {
    expect(maskRows(indexMask(DIAGONAL, 1))).toEqual(['#...', '.#..', '..#.', '#..#']);
    expect(maskRows(indexMask(REGIONS, 2))).toEqual(['...#', '...#', '...#', '..##']);
    expect(maskRows(indexMask(REGIONS, 0))).toEqual(['..#.', '.##.', '#.#.', '##..']);
  });

  test('an unused index selects nothing', () => {
    expect(indexMask(REGIONS, 5)).toEqual(emptyMask(REGIONS));
  });
});

describe('combine modes', () => {
  const base = maskFromRows(['###..', '###..']);
  const incoming = maskFromRows(['.###.', '.###.']);
  const CASES: readonly { readonly mode: CombineMode; readonly rows: readonly string[] }[] = [
    { mode: 'replace', rows: ['.###.', '.###.'] },
    { mode: 'add', rows: ['####.', '####.'] },
    { mode: 'subtract', rows: ['#....', '#....'] },
    { mode: 'intersect', rows: ['.##..', '.##..'] },
  ];

  test.each(CASES)('$mode', ({ mode, rows }) => {
    expect(maskRows(combineMasks(base, incoming, mode))).toEqual(rows);
  });

  test('never changes its inputs', () => {
    const copy = base.bits.slice();
    combineMasks(base, incoming, 'subtract');
    expect(base.bits).toEqual(copy);
  });

  test('refuses masks of different sizes', () => {
    expect(() => combineMasks(base, emptyMask({ width: 4, height: 2 }), 'add')).toThrow(RangeError);
  });

  test('replace with nothing clears and add of nothing keeps', () => {
    expect(combineMasks(base, emptyMask(base), 'replace')).toEqual(emptyMask(base));
    expect(combineMasks(base, emptyMask(base), 'add')).toEqual(base);
  });
});

describe('invert', () => {
  test('swaps selected and unselected, and twice is the identity', () => {
    const mask = maskFromRows(['#.#', '.#.']);
    expect(maskRows(invertMask(mask))).toEqual(['.#.', '#.#']);
    expect(invertMask(invertMask(mask))).toEqual(mask);
    expect(invertMask(emptyMask(mask))).toEqual(fullMask(mask));
  });
});

describe('expand and shrink', () => {
  const dot = maskFromRows(['.....', '.....', '..#..', '.....', '.....']);

  test('expand grows by whole pixels with square reach', () => {
    expect(maskRows(expandMask(dot, 1))).toEqual(['.....', '.###.', '.###.', '.###.', '.....']);
    expect(maskRows(expandMask(dot, 2))).toEqual(['#####', '#####', '#####', '#####', '#####']);
  });

  test('expand stops at the canvas edge', () => {
    const corner = maskFromRows(['#....', '.....', '.....']);
    expect(maskRows(expandMask(corner, 1))).toEqual(['##...', '##...', '.....']);
  });

  test('shrink erodes by whole pixels and counts outside the canvas as unselected', () => {
    const block = maskFromRows(['.....', '.###.', '.###.', '.###.', '.....']);
    expect(maskRows(shrinkMask(block, 1))).toEqual(['.....', '.....', '..#..', '.....', '.....']);
    expect(maskRows(shrinkMask(block, 2))).toEqual(['.....', '.....', '.....', '.....', '.....']);
    expect(maskRows(shrinkMask(fullMask({ width: 5, height: 5 }), 1))).toEqual(['.....', '.###.', '.###.', '.###.', '.....']);
  });

  test('a radius of zero changes nothing and a huge radius fills or empties', () => {
    expect(expandMask(dot, 0)).toEqual(dot);
    expect(shrinkMask(dot, 0)).toEqual(dot);
    expect(maskRows(expandMask(dot, 100000))).toEqual(maskRows(fullMask(dot)));
    expect(shrinkMask(fullMask(dot), 100000)).toEqual(emptyMask(dot));
    expect(expandMask(emptyMask(dot), 3)).toEqual(emptyMask(dot));
  });

  test('shrink undoes expand on a mask that does not touch the edge', () => {
    const shape = maskFromRows(['.......', '..##...', '..###..', '...#...', '.......']);
    expect(shrinkMask(expandMask(shape, 1), 1)).toEqual(shape);
  });
});

describe('mask bounds', () => {
  test('is the tight rectangle around the selected pixels', () => {
    expect(maskBounds(maskFromRows(['.....', '..#..', '.....', '....#']))).toEqual({ x: 2, y: 1, width: 3, height: 3 });
    expect(maskBounds(fullMask({ width: 4, height: 3 }))).toEqual({ x: 0, y: 0, width: 4, height: 3 });
  });

  test('an empty mask has no bounds', () => {
    expect(maskBounds(emptyMask({ width: 4, height: 3 }))).toBeNull();
  });
});
