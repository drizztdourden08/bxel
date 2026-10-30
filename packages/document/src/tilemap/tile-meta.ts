/* @layer core @kind logic */
import type { Tile } from '../model/tilemap.type';
import type { TileMeta } from './tile-meta.type';

const tileMeta = (tile: Tile): TileMeta => ({
  ...(tile.type ? { type: tile.type } : {}),
  ...(tile.probability !== undefined ? { probability: tile.probability } : {}),
  ...(tile.turns ? { turns: tile.turns } : {}),
  ...(tile.data ? { data: tile.data } : {}),
});

export { tileMeta };
