/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { TilemapId } from '../model/ids.type';
import { blitTile } from './blit-tile';
import type { FlatTilemap } from './flat-tilemap.type';
import { requireTilemap } from './require-tilemap';
import { requireTileset } from './require-tileset';
import { tileSources } from './tile-sources';
import { cellKey } from '../tilemap/cell-key';

const flattenTilemap = (artwork: Artwork, tilemapId: TilemapId): FlatTilemap => {
  const tilemap = requireTilemap(artwork, tilemapId);
  const tileset = requireTileset(artwork, tilemap.tilesetId);
  const tile = { width: tileset.tileWidth, height: tileset.tileHeight };
  const width = tilemap.columns * tile.width;
  const target = new Uint8Array(width * tilemap.rows * tile.height);
  const sourceOf = tileSources(artwork, tileset);
  for (const layer of tilemap.layers.filter((item) => item.visible)) {
    for (const [index, cell] of layer.cells.entries()) {
      const source = cellKey(cell) === 0 ? null : sourceOf(cellKey(cell));
      if (!source) continue;
      const column = index % tilemap.columns;
      const origin = { x: column * tile.width, y: ((index - column) / tilemap.columns) * tile.height };
      blitTile({ target, targetWidth: width, source, tile, origin, cell });
    }
  }
  return { width, height: tilemap.rows * tile.height, bankId: tileset.bankId, pixels: target };
};

export { flattenTilemap };
