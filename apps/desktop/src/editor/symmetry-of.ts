/* @layer renderer-app @kind logic */
import type { Point, Size, Symmetry } from '@bxel/raster';
import { areaSymmetry } from './area-symmetry';
import type { SymmetryFields } from './editor.type';
import { shiftSymmetry } from './shift-symmetry';
import { symmetryCell } from './symmetry-cell';

const symmetryOf = (settings: SymmetryFields, size: Size, at: Point | null = null): Symmetry => {
  const cell = symmetryCell(size, at);
  if (!cell) return areaSymmetry(settings, size);
  return shiftSymmetry(areaSymmetry({ ...settings, axisX: null, axisY: null }, cell), cell);
};

export { symmetryOf };
