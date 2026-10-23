/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { brushStamp } from '../../packages/raster/src/index';
import type { BrushShape } from '../../packages/raster/src/index';
import { toRows } from './to-rows';

const render = (shape: BrushShape, size: number): string[] => {
  const stamp = brushStamp({ shape, size });
  return toRows({ pixels: stamp.cells, width: stamp.size, height: stamp.size });
};

const CIRCLES: readonly (readonly [number, readonly string[]])[] = [
  [1, ['1']],
  [2, ['11', '11']],
  [3, ['.1.', '111', '.1.']],
  [4, ['.11.', '1111', '1111', '.11.']],
  [5, ['.111.', '11111', '11111', '11111', '.111.']],
  [6, ['..11..', '.1111.', '111111', '111111', '.1111.', '..11..']],
  [7, ['..111..', '.11111.', '1111111', '1111111', '1111111', '.11111.', '..111..']],
  [8, ['..1111..', '.111111.', '11111111', '11111111', '11111111', '11111111', '.111111.', '..1111..']],
  [9, ['...111...', '.1111111.', '.1111111.', '111111111', '111111111', '111111111', '.1111111.', '.1111111.', '...111...']],
];

const isMirrored = (cells: Uint8Array, size: number): boolean => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const here = cells[row * size + col];
      const sideways = cells[row * size + (size - 1 - col)];
      const upright = cells[(size - 1 - row) * size + col];
      const turned = cells[col * size + row];
      if (here !== sideways || here !== upright || here !== turned) {
        return false;
      }
    }
  }
  return true;
};

describe('brush stamps', () => {
  test.each(CIRCLES)('circle of size %i matches the golden rows', (size, rows) => {
    expect(render('circle', size)).toEqual(rows);
  });

  test.each([1, 2, 3, 7])('square of size %i is solid', (size) => {
    const rows = render('square', size);
    expect(rows).toHaveLength(size);
    expect(rows.every((row) => row === '1'.repeat(size))).toBe(true);
  });

  test('every size from 1 to 64 is symmetric across both axes and the diagonal', () => {
    for (let size = 1; size <= 64; size++) {
      expect(isMirrored(brushStamp({ shape: 'circle', size }).cells, size)).toBe(true);
    }
  });

  test('the stamp offset centres odd sizes and leans even sizes to the top left', () => {
    expect(brushStamp({ shape: 'square', size: 1 }).offset).toBe(0);
    expect(brushStamp({ shape: 'square', size: 2 }).offset).toBe(0);
    expect(brushStamp({ shape: 'square', size: 3 }).offset).toBe(1);
    expect(brushStamp({ shape: 'square', size: 4 }).offset).toBe(1);
  });

  test('sizes outside 1 to 64 are clamped', () => {
    expect(brushStamp({ shape: 'square', size: 0 }).size).toBe(1);
    expect(brushStamp({ shape: 'square', size: 500 }).size).toBe(64);
  });
});
