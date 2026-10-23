/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { pixelPerfect, strokePoints } from '../../packages/raster/src/index';
import type { Point } from '../../packages/raster/src/index';
import { plotPoints } from './plot-points';

const at = (x: number, y: number): Point => ({ x, y });

describe('pixel perfect', () => {
  test('a staircase loses the doubled corner pixels', () => {
    const path = [at(0, 0), at(1, 0), at(1, 1), at(2, 1), at(2, 2), at(3, 2)];
    expect(plotPoints(path, 4, 3)).toEqual(['11..', '.11.', '..11']);
    expect(plotPoints(pixelPerfect(path), 4, 3)).toEqual(['1...', '.1..', '..11']);
  });

  test('a staircase going up is filtered the same way', () => {
    const path = [at(0, 2), at(1, 2), at(1, 1), at(2, 1), at(2, 0), at(3, 0)];
    expect(plotPoints(pixelPerfect(path), 4, 3)).toEqual(['..11', '.1..', '1...']);
  });

  test('a single L becomes a diagonal step', () => {
    expect(plotPoints(pixelPerfect([at(0, 0), at(1, 0), at(1, 1)]), 3, 2)).toEqual(['1..', '.1.']);
  });

  test('both L orientations are recognised', () => {
    expect(pixelPerfect([at(0, 0), at(0, 1), at(1, 1)])).toEqual([at(0, 0), at(1, 1)]);
    expect(pixelPerfect([at(0, 0), at(1, 0), at(1, 1)])).toEqual([at(0, 0), at(1, 1)]);
    expect(pixelPerfect([at(1, 1), at(0, 1), at(0, 0)])).toEqual([at(1, 1), at(0, 0)]);
    expect(pixelPerfect([at(1, 0), at(0, 0), at(0, 1)])).toEqual([at(1, 0), at(0, 1)]);
  });

  test('a corner at the end of a straight run drops only the corner pixel', () => {
    const path = strokePoints([at(0, 0), at(4, 0), at(4, 4)]);
    expect(plotPoints(pixelPerfect(path), 5, 5)).toEqual(['1111.', '....1', '....1', '....1', '....1']);
  });

  test('straight lines and clean diagonals are left alone', () => {
    const flat = strokePoints([at(0, 0), at(5, 0)]);
    const diagonal = strokePoints([at(0, 0), at(5, 5)]);
    expect(pixelPerfect(flat)).toEqual(flat);
    expect(pixelPerfect(diagonal)).toEqual(diagonal);
  });

  test('short strokes pass through', () => {
    expect(pixelPerfect([])).toEqual([]);
    expect(pixelPerfect([at(3, 3)])).toEqual([at(3, 3)]);
    expect(pixelPerfect([at(3, 3), at(4, 3)])).toEqual([at(3, 3), at(4, 3)]);
  });

  test('the filtered stroke stays connected from end to end', () => {
    const path = strokePoints([at(0, 0), at(9, 2), at(12, 9), at(3, 11), at(1, 3)]);
    const kept = pixelPerfect(path);
    expect(kept[0]).toEqual(path[0]);
    expect(kept.at(-1)).toEqual(path.at(-1));
    for (let i = 1; i < kept.length; i++) {
      expect(Math.abs((kept[i]?.x ?? 0) - (kept[i - 1]?.x ?? 0))).toBeLessThanOrEqual(1);
      expect(Math.abs((kept[i]?.y ?? 0) - (kept[i - 1]?.y ?? 0))).toBeLessThanOrEqual(1);
    }
  });
});
