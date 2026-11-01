/* @layer core @kind logic */
import { PATTERN_TILES } from '../pattern/pattern-tiles.constants';
import type { TilePatternId } from '../pattern/pattern.type';
import type { Wrap } from '../wrap.type';
import { bayerMatrix } from './bayer-matrix';
import type { GradientDither } from './gradient-dither.type';
import type { GradientOptions } from './gradient.type';
import { seamlessSide } from './seamless-side';

const TILE_MATRIX = new Uint8Array(1);

const tileSeams = (id: TilePatternId, room: { readonly width: number; readonly height: number }, wrap: Wrap): boolean => {
  const tile = PATTERN_TILES[id];
  return (wrap.x === true && room.width % tile.width !== 0) || (wrap.y === true && room.height % tile.height !== 0);
};

const gradientDither = ({ bayer, target, wrap, pattern, stencil }: GradientOptions): GradientDither | null => {
  if (bayer === null) return null;
  if (stencil) return { style: 'checker', grid: { matrix: TILE_MATRIX, side: 1 }, stencil };
  const style = pattern ?? 'bayer';
  if (style !== 'bayer') return tileSeams(style, target, wrap ?? {}) ? null : { style, grid: { matrix: TILE_MATRIX, side: 1 } };
  const side = seamlessSide(bayer, target, wrap ?? {});
  if (side === 1) return null;
  return { style, grid: { matrix: bayerMatrix(side), side } };
};

export { gradientDither };
