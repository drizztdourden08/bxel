/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { linePoints } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import { plotPoints } from './plot-points';

type LineCase = { readonly name: string; readonly from: Point; readonly to: Point; readonly rows: readonly string[] };

const CENTER: Point = { x: 3, y: 3 };

const OCTANTS: readonly LineCase[] = [
  { name: 'east to south east', from: CENTER, to: { x: 6, y: 4 }, rows: ['.......', '.......', '.......', '...11..', '.....11', '.......', '.......'] },
  { name: 'west to north west', from: CENTER, to: { x: 0, y: 2 }, rows: ['.......', '.......', '11.....', '..11...', '.......', '.......', '.......'] },
  { name: 'due east', from: CENTER, to: { x: 6, y: 3 }, rows: ['.......', '.......', '.......', '...1111', '.......', '.......', '.......'] },
  { name: 'due north', from: CENTER, to: { x: 3, y: 0 }, rows: ['...1...', '...1...', '...1...', '...1...', '.......', '.......', '.......'] },
  { name: 'diagonal south east', from: CENTER, to: { x: 6, y: 6 }, rows: ['.......', '.......', '.......', '...1...', '....1..', '.....1.', '......1'] },
];

describe('K1 line points', { tags: ['critical'] }, () => {
  test.each(OCTANTS)('$name', ({ from, to, rows }) => {
    expect(plotPoints(linePoints({ from, to }), 7, 7)).toEqual(rows);
  });

  test('a single point is a line of one pixel', () => {
    expect(linePoints({ from: { x: 2, y: 2 }, to: { x: 2, y: 2 } })).toEqual([{ x: 2, y: 2 }]);
  });

  test('every line from the centre has the right length and end points', () => {
    for (let x = 0; x <= 12; x++) {
      for (let y = 0; y <= 12; y++) {
        const points = linePoints({ from: { x: 6, y: 6 }, to: { x, y } });
        const length = Math.max(Math.abs(x - 6), Math.abs(y - 6)) + 1;
        expect(points).toHaveLength(length);
        expect(points[0]).toEqual({ x: 6, y: 6 });
        expect(points.at(-1)).toEqual({ x, y });
      }
    }
  });
});
