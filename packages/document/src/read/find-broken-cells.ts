/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { MapLayer, Tilemap } from '../model/tilemap.type';
import { cellKey } from '../tilemap/cell-key';
import type { BrokenCell } from './broken-cell.type';
import { findTileset } from './find-tileset';

const scanLayer = (tilemap: Tilemap, layer: MapLayer, keys: ReadonlySet<number>, room: number): BrokenCell[] => {
  const found: BrokenCell[] = [];
  for (const [index, cell] of layer.cells.entries()) {
    const key = cellKey(cell);
    if (key === 0 || keys.has(key)) continue;
    const x = index % tilemap.columns;
    found.push({ tilemapId: tilemap.id, layerId: layer.id, x, y: (index - x) / tilemap.columns, key });
    if (found.length >= room) break;
  }
  return found;
};

const findBrokenCells = (artwork: Artwork, limit: number): readonly BrokenCell[] => {
  const found: BrokenCell[] = [];
  for (const tilemap of artwork.tilemaps) {
    const keys = new Set(findTileset(artwork, tilemap.tilesetId)?.tiles.map((tile) => tile.key));
    for (const layer of tilemap.layers) {
      found.push(...scanLayer(tilemap, layer, keys, limit - found.length));
    }
    if (found.length >= limit) break;
  }
  return found;
};

export { findBrokenCells };
