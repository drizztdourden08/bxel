/* @layer core @kind logic */
import { foldCoord } from '../fold-coord';
import { tileCell } from '../pattern/tile-cell';
import { BAYER } from './dither-on.constants';
import { DITHER_SIDE } from './ink.constants';
import type { DitherPattern } from './ink.type';

const ditherOn = (pattern: DitherPattern, level: number, x: number, y: number): boolean => {
  if (pattern !== 'bayer') return tileCell(pattern, x, y);
  return (BAYER[foldCoord(y, DITHER_SIDE) * DITHER_SIDE + foldCoord(x, DITHER_SIDE)] ?? 0) < level;
};

export { ditherOn };
