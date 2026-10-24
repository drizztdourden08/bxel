/* @layer core @kind logic */
import type { CellFlags } from '../model/cell-flags.type';
import { CELL } from './cell.constants';

const readCellFlags = (cell: number): CellFlags => ({
  flipX: (cell & CELL.FLIP_X) !== 0,
  flipY: (cell & CELL.FLIP_Y) !== 0,
  diagonal: (cell & CELL.DIAGONAL) !== 0,
});

export { readCellFlags };
