/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { TilemapId } from '../model/ids.type';
import { mapGeometry } from '../tilemap/geometry/map-geometry';
import { cellKey } from '../tilemap/cell-key';
import { blitTile } from './blit-tile';
import type { FlatTilemap } from './flat-tilemap.type';
import { requireTilemap } from './require-tilemap';
import { requireTileset } from './require-tileset';
import { tileSources } from './tile-sources';

const flattenTilemap = (artwork: Artwork, tilemapId: TilemapId): FlatTilemap => {
  const tilemap = requireTilemap(artwork, tilemapId);
  const tileset = requireTileset(artwork, tilemap.tilesetId);
  const tile = { width: tileset.tileWidth, height: tileset.tileHeight };
  const geometry = mapGeometry({ columns: tilemap.columns, rows: tilemap.rows, tile, orientation: tilemap.orientation });
  const target = new Uint8Array(geometry.width * geometry.height);
  const sourceOf = tileSources(artwork, tileset);
  for (const layer of tilemap.layers.filter((item) => item.visible)) {
    for (const [index, cell] of layer.cells.entries()) {
      const source = cellKey(cell) === 0 ? null : sourceOf(cellKey(cell));
      if (!source) continue;
      const column = index % tilemap.columns;
      const origin = geometry.originOf(column, (index - column) / tilemap.columns);
      blitTile({ target, targetWidth: geometry.width, source, tile, origin, cell });
    }
  }
  return { width: geometry.width, height: geometry.height, bankId: tileset.bankId, pixels: target };
};

export { flattenTilemap };
