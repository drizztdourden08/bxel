/* @layer tests @kind test */
import { curvePoints, drawPath } from '@bxel/raster';
import type { PathKind, Point } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { blankBuffer } from './blank-buffer';
import { maskFromRows } from './mask-from-rows';
import { toRows } from './to-rows';

const BRUSH = { shape: 'square', size: 1 } as const;
const TRIANGLE = [{ x: 1, y: 1 }, { x: 7, y: 1 }, { x: 4, y: 5 }];
const BOW = [{ x: 1, y: 5 }, { x: 4, y: 0 }, { x: 8, y: 5 }];
const FREEHAND = [{ x: 1, y: 1 }, { x: 3, y: 0 }, { x: 6, y: 1 }, { x: 7, y: 4 }, { x: 4, y: 5 }, { x: 2, y: 4 }];

const draw = (kind: PathKind, points: readonly Point[], filled: boolean, size = { width: 9, height: 7 }): string[] => {
  const target = blankBuffer(size.width, size.height);
  drawPath({ target, index: 2, kind, points, filled, brush: BRUSH });
  return toRows(target);
};

const gaps = (points: readonly Point[]): number =>
  points.filter((point, at) => {
    const previous = points[at - 1];
    return previous !== undefined && Math.max(Math.abs(point.x - previous.x), Math.abs(point.y - previous.y)) > 1;
  }).length;

describe('polygon', () => {
  test('outlines a closed triangle', () => {
    expect(draw('polygon', TRIANGLE, false)).toEqual([
      '.........',
      '.2222222.',
      '..2...2..',
      '..2..2...',
      '...2.2...',
      '....2....',
      '.........',
    ]);
  });

  test('fills a triangle with the even odd rule', () => {
    expect(draw('polygon', TRIANGLE, true)).toEqual([
      '.........',
      '.2222222.',
      '..22222..',
      '..2222...',
      '...222...',
      '....2....',
      '.........',
    ]);
  });

  test('a self crossing bow tie leaves its crossing region as two lobes', () => {
    const bow = [{ x: 0, y: 0 }, { x: 4, y: 4 }, { x: 4, y: 0 }, { x: 0, y: 4 }];
    expect(draw('polygon', bow, true, { width: 5, height: 5 })).toEqual(['2...2', '22.22', '22222', '22.22', '2...2']);
  });

  test('the brush thickens an outline', () => {
    const target = blankBuffer(9, 7);
    drawPath({ target, index: 2, kind: 'polygon', points: TRIANGLE, filled: false, brush: { shape: 'square', size: 2 } });
    expect(toRows(target)).toEqual(['.........', '.22222222', '.22222222', '..22.222.', '..22222..', '...2222..', '....22...']);
  });

  test('a mask clips the shape', () => {
    const target = blankBuffer(9, 7);
    const mask = maskFromRows(['.........', '.........', '..#######', '..#######', '..#######', '..#######', '..#######']);
    drawPath({ target, index: 2, kind: 'polygon', points: TRIANGLE, filled: true, brush: BRUSH, mask });
    expect(toRows(target)[1]).toBe('.........');
    expect(toRows(target)[2]).toBe('..22222..');
  });

  test('symmetry mirrors the vertices', () => {
    const target = blankBuffer(12, 7);
    drawPath({ target, index: 2, kind: 'polygon', points: TRIANGLE, filled: true, brush: BRUSH, symmetry: { x2: 12 } });
    const row = toRows(target)[1] ?? '';
    expect([...row].reverse().join('')).toBe(row);
  });
});

describe('curve', () => {
  test('bends a quadratic Bezier through its control point side', () => {
    expect(draw('curve', BOW, false, { width: 10, height: 7 })).toEqual([
      '..........',
      '..........',
      '..........',
      '...2222...',
      '..2....2..',
      '.2......2.',
      '..........',
    ]);
  });

  test('keeps both end points and leaves no gap', () => {
    const points = curvePoints(BOW);
    expect(points[0]).toEqual({ x: 1, y: 5 });
    expect(points[points.length - 1]).toEqual({ x: 8, y: 5 });
    expect(gaps(points)).toBe(0);
  });

  test('stays connected for steep and long curves', () => {
    const shapes = [
      [{ x: 0, y: 0 }, { x: 0, y: 40 }, { x: 40, y: 40 }],
      [{ x: 0, y: 0 }, { x: 90, y: 3 }, { x: 5, y: 60 }],
      [{ x: 3, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 3 }],
      [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 20, y: 0 }],
    ];
    for (const shape of shapes) {
      const points = curvePoints(shape);
      expect(points.length).toBeGreaterThan(0);
      expect(gaps(points)).toBe(0);
    }
  });

  test('a filled curve closes against its chord', () => {
    expect(draw('curve', BOW, true, { width: 10, height: 7 }).slice(3)).toEqual(['...2222...', '..222222..', '.22222222.', '..........']);
  });
});

describe('contour', () => {
  test('outlines a closed freehand loop', () => {
    expect(draw('contour', FREEHAND, false)).toEqual([
      '..222....',
      '.2...22..',
      '.2....2..',
      '..2....2.',
      '..22..22.',
      '....22...',
      '.........',
    ]);
  });

  test('fills a closed freehand loop', () => {
    expect(draw('contour', FREEHAND, true)).toEqual([
      '..222....',
      '.222222..',
      '.222222..',
      '..222222.',
      '..222222.',
      '....22...',
      '.........',
    ]);
  });

  test('repeated points do not change the loop', () => {
    const doubled = FREEHAND.flatMap((point) => [point, point]);
    expect(draw('contour', doubled, false)).toEqual(draw('contour', FREEHAND, false));
  });
});
