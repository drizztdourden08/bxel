/* @layer renderer-app @kind logic */
import { MAX_POINTS } from '@bxel/document';
import type { Point, Size } from '@bxel/document';

const nextCells = (cells: readonly Point[], cell: Point, step: Size): Point[] => {
  const last = cells.at(-1);
  if (!last || cells.length >= MAX_POINTS - 1) return [...cells];
  const far = Math.abs(cell.x - last.x) >= step.width || Math.abs(cell.y - last.y) >= step.height;
  return far ? [...cells, cell] : [...cells];
};

export { nextCells };
