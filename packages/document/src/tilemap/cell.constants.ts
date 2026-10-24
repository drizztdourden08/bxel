/* @layer core @kind config */
import type { CellFlags } from '../model/cell-flags.type';

const CELL = {
  KEY_MASK: 0x0fffffff,
  FLIP_X: 0x80000000,
  FLIP_Y: 0x40000000,
  DIAGONAL: 0x20000000,
  FLAG_MASK: 0xe0000000,
} as const;

const NO_FLAGS: CellFlags = { flipX: false, flipY: false, diagonal: false };

export { CELL, NO_FLAGS };
