/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { Tilemap } from '../model/tilemap.type';
import { cellKey } from '../tilemap/cell-key';
import { readCellFlags } from '../tilemap/read-cell-flags';
import { findTile } from './find-tile';
import { findTilemap } from './find-tilemap';
import { findTileset } from './find-tileset';
import type { MapCellQuery, PickedCell } from './pick-map-cell.type';

const inside = (tilemap: Tilemap, x: number, y: number): boolean => x >= 0 && y >= 0 && x < tilemap.columns && y < tilemap.rows;

const pickMapCell = (artwork: Artwork, query: MapCellQuery): PickedCell | null => {
  const tilemap = findTilemap(artwork, query.tilemapId);
  const layer = tilemap?.layers.find((item) => item.id === query.layerId);
  const { x, y } = query.at;
  if (!tilemap || !layer || !inside(tilemap, x, y)) return null;
  const cell = layer.cells[y * tilemap.columns + x] ?? 0;
  const tileset = findTileset(artwork, tilemap.tilesetId);
  const tile = tileset ? findTile(tileset, cellKey(cell)) : undefined;
  return { key: cellKey(cell), flags: readCellFlags(cell), tile: tile ?? null };
};

export { pickMapCell };
