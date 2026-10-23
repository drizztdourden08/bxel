/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { floodFill } from '@bxel/raster';
import type { Connectivity, Point, Rect } from '@bxel/raster';
import { blankBuffer } from './blank-buffer';
import { fromRows } from './from-rows';
import { toRows } from './to-rows';

type FillCase = {
  readonly name: string;
  readonly before: readonly string[];
  readonly seed: Point;
  readonly index: number;
  readonly connectivity: Connectivity;
  readonly after: readonly string[];
  readonly rect: Rect;
};

const RING = ['.....', '.111.', '.1.1.', '.11..', '.....'];
const DIAGONAL = ['1....', '.1...', '..1..', '...1.', '....1'];
const DIAMOND = ['.1...', '1.1..', '.1.1.', '..1..', '.....'];
const WHOLE: Rect = { x: 0, y: 0, width: 5, height: 5 };

const CASES: readonly FillCase[] = [
  { name: '4-way leaves the diagonal gap of a ring closed', before: RING, seed: { x: 0, y: 0 }, index: 2, connectivity: 4, after: ['22222', '21112', '21.12', '21122', '22222'], rect: WHOLE },
  { name: '8-way slips through the diagonal gap of a ring', before: RING, seed: { x: 0, y: 0 }, index: 2, connectivity: 8, after: ['22222', '21112', '21212', '21122', '22222'], rect: WHOLE },
  { name: '4-way sees a diagonal line as separate pixels', before: DIAGONAL, seed: { x: 0, y: 0 }, index: 2, connectivity: 4, after: ['2....', '.1...', '..1..', '...1.', '....1'], rect: { x: 0, y: 0, width: 1, height: 1 } },
  { name: '8-way follows a diagonal line', before: DIAGONAL, seed: { x: 0, y: 0 }, index: 2, connectivity: 8, after: ['2....', '.2...', '..2..', '...2.', '....2'], rect: WHOLE },
  { name: '4-way stays inside a diamond hole', before: DIAMOND, seed: { x: 1, y: 1 }, index: 3, connectivity: 4, after: ['.1...', '131..', '.1.1.', '..1..', '.....'], rect: { x: 1, y: 1, width: 1, height: 1 } },
  { name: '8-way escapes a diamond hole', before: DIAMOND, seed: { x: 1, y: 1 }, index: 3, connectivity: 8, after: ['31333', '13133', '31313', '33133', '33333'], rect: WHOLE },
  { name: 'a closed ring holds the fill', before: ['11111', '1...1', '1.1.1', '1...1', '11111'], seed: { x: 1, y: 1 }, index: 3, connectivity: 4, after: ['11111', '13331', '13131', '13331', '11111'], rect: { x: 1, y: 1, width: 3, height: 3 } },
  { name: 'only the exact index spreads', before: ['11222', '11232', '11222'], seed: { x: 3, y: 0 }, index: 4, connectivity: 8, after: ['11444', '11434', '11444'], rect: { x: 2, y: 0, width: 3, height: 3 } },
  { name: 'a comb is filled end to end', before: ['.....', '1111.', '.....', '.1111', '.....'], seed: { x: 0, y: 0 }, index: 2, connectivity: 4, after: ['22222', '11112', '22222', '21111', '22222'], rect: WHOLE },
];

describe('contiguous fill', () => {
  test.each(CASES)('$name', ({ before, seed, index, connectivity, after, rect }) => {
    const target = fromRows(before);
    expect(floodFill({ target, seed, index, mode: 'contiguous', connectivity })).toEqual(rect);
    expect(toRows(target)).toEqual(after);
  });

  test('the default connectivity is 4', () => {
    const target = fromRows(DIAGONAL);
    floodFill({ target, seed: { x: 0, y: 0 }, index: 2, mode: 'contiguous' });
    expect(toRows(target)).toEqual(['2....', '.1...', '..1..', '...1.', '....1']);
  });

  test('a large empty canvas fills without recursion', () => {
    const target = blankBuffer(512, 512);
    const rect = floodFill({ target, seed: { x: 100, y: 200 }, index: 7, mode: 'contiguous', connectivity: 8 });
    expect(rect).toEqual({ x: 0, y: 0, width: 512, height: 512 });
    expect(target.pixels.every((value) => value === 7)).toBe(true);
  });
});
