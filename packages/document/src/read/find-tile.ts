/* @layer core @kind logic */
import type { Tile, Tileset } from '../model/tilemap.type';

const findTile = (tileset: Tileset, key: number): Tile | undefined => tileset.tiles.find((tile) => tile.key === key);

export { findTile };
