/* @layer core @kind logic */
import type { Point, Size } from '../../model/geometry.type';

const clampToGrid = (cell: Point, grid: Size): Point => ({
  x: Math.min(grid.width - 1, Math.max(0, cell.x)),
  y: Math.min(grid.height - 1, Math.max(0, cell.y)),
});

export { clampToGrid };
