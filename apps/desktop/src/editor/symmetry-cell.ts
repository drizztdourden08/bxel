/* @layer renderer-app @kind logic */
import type { Point, Rect, Size } from '@bxel/raster';
import { tileCellOf } from './tile-cell-of';

const cellStart = (value: number, cell: number, length: number): number =>
  Math.min(Math.floor(value / cell), Math.max(0, Math.ceil(length / cell) - 1)) * cell;

const symmetryCell = (size: Size, at: Point | null): Rect | null => {
  const cell = tileCellOf();
  if (!cell || !at) return null;
  const x = cellStart(Math.max(0, at.x), cell.width, size.width);
  const y = cellStart(Math.max(0, at.y), cell.height, size.height);
  return { x, y, width: Math.min(cell.width, size.width - x), height: Math.min(cell.height, size.height - y) };
};

export { symmetryCell };
