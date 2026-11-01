/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { antiAlias } from '../src/aa/anti-alias';

const grid = (rows: readonly string[]) => ({
  pixels: Uint8Array.from(rows.join('').split('').map((char) => (char === '.' ? 0 : Number(char)))),
  width: rows[0]?.length ?? 0,
  height: rows.length,
});

describe('antiAlias', () => {
  test('puts the in between colour at the two corners of a stair step on empty pixels', () => {
    const found = antiAlias({ ...grid(['111..', '...11', '.....']), edge: 1, mid: 2, inside: false });
    expect(found).toEqual([{ x: 3, y: 0, index: 2 }, { x: 2, y: 1, index: 2 }]);
  });

  test('finds steps of vertical lines too', () => {
    const found = antiAlias({ ...grid(['1..', '1..', '.1.', '.1.']), edge: 1, mid: 2, inside: false });
    expect(found).toHaveLength(2);
    expect(found).toContainEqual({ x: 1, y: 1, index: 2 });
    expect(found).toContainEqual({ x: 0, y: 2, index: 2 });
  });

  test('leaves filled pixels alone unless inside is on', () => {
    const rows = ['111.3', '33311', '33333'];
    expect(antiAlias({ ...grid(rows), edge: 1, mid: 2, inside: false })).toEqual([{ x: 3, y: 0, index: 2 }]);
    expect(antiAlias({ ...grid(rows), edge: 1, mid: 2, inside: true }).map((each) => [each.x, each.y])).toContainEqual([2, 1]);
  });

  test('a straight line has no steps', () => {
    expect(antiAlias({ ...grid(['1111', '....']), edge: 1, mid: 2, inside: false })).toEqual([]);
  });

  test('a single pixel step is not a stair', () => {
    expect(antiAlias({ ...grid(['1.', '.1']), edge: 1, mid: 2, inside: false })).toEqual([]);
  });
});
