/* @layer core @kind logic */
import { foldCoord } from '../fold-coord';
import { PATTERN_TILES } from './pattern-tiles.constants';
import type { TilePatternId } from './pattern.type';

/** Whether a built-in tile pattern is on at a canvas cell. The tile repeats from the origin, also into negative cells. */
const tileCell = (id: TilePatternId, x: number, y: number): boolean => {
  const tile = PATTERN_TILES[id];
  return tile.on[foldCoord(y, tile.height) * tile.width + foldCoord(x, tile.width)] === true;
};

export { tileCell };
