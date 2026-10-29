/* @layer core @kind logic */
import type { Tile } from '../../model/tilemap.type';
import type { TileKeep } from './attach-tile';

const tileKeep = (tile: Tile): TileKeep => ({
  ...(tile.shapes ? { shapes: tile.shapes } : {}),
  ...(tile.type ? { type: tile.type } : {}),
  ...(tile.probability !== undefined ? { probability: tile.probability } : {}),
  ...(tile.turns ? { turns: tile.turns } : {}),
  ...(tile.data ? { data: tile.data } : {}),
});

export { tileKeep };
