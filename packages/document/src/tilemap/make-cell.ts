/* @layer core @kind logic */
import type { CellFlags } from '../model/cell-flags.type';
import { CELL } from './cell.constants';

const make = (key: number, flags: CellFlags): number =>
  key | (flags.flipX ? CELL.FLIP_X : 0) | (flags.flipY ? CELL.FLIP_Y : 0) | (flags.diagonal ? CELL.DIAGONAL : 0);

const makeCell = (key: number, flags: CellFlags): number => (key === 0 ? 0 : make(key, flags) >>> 0);

export { makeCell };
