/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { linePoints } from '../../packages/raster/src/index';
import type { Point } from '../../packages/raster/src/index';
import { plotPoints } from './plot-points';

type LineCase = { readonly name: string; readonly from: Point; readonly to: Point; readonly rows: readonly string[] };

const CENTER: Point = { x: 3, y: 3 };

const OCTANTS: readonly LineCase[] = [
  { name: 'east to south east', from: CENTER, to: { x: 6, y: 4 }, rows: ['.......', '.......', '.......', '...11..', '.....11', '.......', '.......'] },
  { name: 'south to south east', from: CENTER, to: { x: 4, y: 6 }, rows: ['.......', '.......', '.......', '...1...', '...1...', '....1..', '....1..'] },
  { name: 'south to south west', from: CENTER, to: { x: 2, y: 6 }, rows: ['.......', '.......', '.......', '...1...', '...1...', '..1....', '..1....'] },
  { name: 'west to south west', from: CENTER, to: { x: 0, y: 4 }, rows: ['.......', '.......', '.......', '..11...', '11.....', '.......', '.......'] },
  { name: 'west to north west', from: CENTER, to: { x: 0, y: 2 }, rows: ['.......', '.......', '11.....', '..11...', '.......', '.......', '.......'] },
  { name: 'north to north west', from: CENTER, to: { x: 2, y: 0 }, rows: ['..1....', '..1....', '...1...', '...1...', '.......', '.......', '.......'] },
  { name: 'north to north east', from: CENTER, to: { x: 4, y: 0 }, rows: ['....1..', '....1..', '...1...', '...1...', '.......', '.......', '.......'] },
  { name: 'east to north east', from: CENTER, to: { x: 6, y: 2 }, rows: ['.......', '.......', '.....11', '...11..', '.......', '.......', '.......'] },
  { name: 'due east', from: CENTER, to: { x: 6, y: 3 }, rows: ['.......', '.......', '.......', '...1111', '.......', '.......', '.......'] },
  { name: 'due north', from: CENTER, to: { x: 3, y: 0 }, rows: ['...1...', '...1...', '...1...', '...1...', '.......', '.......', '.......'] },
  { name: 'diagonal south east', from: CENTER, to: { x: 6, y: 6 }, rows: ['.......', '.......', '.......', '...1...', '....1..', '.....1.', '......1'] },
  { name: 'diagonal north west', from: CENTER, to: { x: 0, y: 0 }, rows: ['1......', '.1.....', '..1....', '...1...', '.......', '.......', '.......'] },
];

describe('line points', () => {
  test.each(OCTANTS)('$name', ({ from, to, rows }) => {
    expect(plotPoints(linePoints({ from, to }), 7, 7)).toEqual(rows);
  });

  test('a single point is a line of one pixel', () => {
    expect(linePoints({ from: { x: 2, y: 2 }, to: { x: 2, y: 2 } })).toEqual([{ x: 2, y: 2 }]);
  });

  test('a shallow line drawn from the other end covers the same pixels', () => {
    const forward = linePoints({ from: { x: 0, y: 0 }, to: { x: 6, y: 2 } });
    const backward = linePoints({ from: { x: 6, y: 2 }, to: { x: 0, y: 0 } });
    expect(plotPoints(forward, 7, 3)).toEqual(['11.....', '..111..', '.....11']);
    expect(plotPoints(backward, 7, 3)).toEqual(['11.....', '..111..', '.....11']);
  });

  test('no gaps: every step moves at most one pixel on each axis, in any direction', () => {
    for (let x = 0; x <= 12; x++) {
      for (let y = 0; y <= 12; y++) {
        const points = linePoints({ from: { x: 6, y: 6 }, to: { x, y } });
        const length = Math.max(Math.abs(x - 6), Math.abs(y - 6)) + 1;
        expect(points).toHaveLength(length);
        expect(points[0]).toEqual({ x: 6, y: 6 });
        expect(points.at(-1)).toEqual({ x, y });
      }
    }
    const steps = linePoints({ from: { x: 1, y: 9 }, to: { x: 40, y: 3 } });
    for (let i = 1; i < steps.length; i++) {
      expect(Math.abs((steps[i]?.x ?? 0) - (steps[i - 1]?.x ?? 0))).toBeLessThanOrEqual(1);
      expect(Math.abs((steps[i]?.y ?? 0) - (steps[i - 1]?.y ?? 0))).toBeLessThanOrEqual(1);
    }
  });

  test('mirroring the end points mirrors the pixels, which keeps symmetric strokes exact', () => {
    const left = linePoints({ from: { x: 1, y: 1 }, to: { x: 6, y: 4 } });
    const right = linePoints({ from: { x: 10, y: 1 }, to: { x: 5, y: 4 } });
    expect(right).toEqual(left.map((point) => ({ x: 11 - point.x, y: point.y })));
  });
});
