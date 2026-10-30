/* @layer core @kind logic */
import type { Tile } from '../../model/tilemap.type';
import { tileMeta } from '../../tilemap/tile-meta';
import type { TileKeep } from './attach-tile.type';

const tileKeep = (tile: Tile): TileKeep => ({
  ...(tile.shapes ? { shapes: tile.shapes } : {}),
  ...tileMeta(tile),
});

export { tileKeep };
