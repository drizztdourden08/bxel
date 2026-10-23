/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { strokePoints } from '@bxel/raster';
import { plotPoints } from './plot-points';

const POLYLINE = [
  { x: 0, y: 0 },
  { x: 3, y: 0 },
  { x: 3, y: 4 },
  { x: 7, y: 1 },
];

describe('stroke points', () => {
  test('a polyline is interpolated with no gaps', () => {
    const path = strokePoints(POLYLINE);
    expect(plotPoints(path, 8, 6)).toEqual([
      '1111....',
      '...1...1',
      '...1.11.',
      '...11...',
      '...1....',
      '........',
    ]);
  });

  test('a joint between two segments is not repeated', () => {
    const path = strokePoints(POLYLINE);
    expect(path).toHaveLength(12);
    for (let i = 1; i < path.length; i++) {
      expect(path[i]).not.toEqual(path[i - 1]);
    }
  });

  test('one point is a one pixel stroke', () => {
    expect(strokePoints([{ x: 4, y: 5 }])).toEqual([{ x: 4, y: 5 }]);
  });

  test('no points is an empty stroke', () => {
    expect(strokePoints([])).toEqual([]);
  });

  test('repeated points collapse into one pixel', () => {
    const point = { x: 2, y: 2 };
    expect(strokePoints([point, point, point])).toEqual([point]);
  });

  test('a pointer jump across the canvas is filled in', () => {
    const path = strokePoints([
      { x: 0, y: 0 },
      { x: 30, y: 1 },
    ]);
    expect(path).toHaveLength(31);
  });
});
