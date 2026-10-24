/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import { CELL } from '../tilemap/cell.constants';

const sourceOffset = (cell: number, size: Size, dx: number, dy: number): number => {
  const y = (cell & CELL.FLIP_Y) !== 0 ? size.height - 1 - dy : dy;
  const x = (cell & CELL.FLIP_X) !== 0 ? size.width - 1 - dx : dx;
  const diagonal = (cell & CELL.DIAGONAL) !== 0 && size.width === size.height;
  return diagonal ? x * size.width + y : y * size.width + x;
};

export { sourceOffset };
