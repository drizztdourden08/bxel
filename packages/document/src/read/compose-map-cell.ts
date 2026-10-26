/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { Tilemap } from '../model/tilemap.type';
import { cellKey } from '../tilemap/cell-key';
import { blitTile } from './blit-tile';
import { requireTileset } from './require-tileset';
import type { TileFrameOf } from './tile-playback.type';
import { tileSources } from './tile-sources';

const composeMapCell = (artwork: Artwork, tilemap: Tilemap, index: number, frameOf?: TileFrameOf): Uint8Array => {
  const tileset = requireTileset(artwork, tilemap.tilesetId);
  const tile = { width: tileset.tileWidth, height: tileset.tileHeight };
  const target = new Uint8Array(tile.width * tile.height);
  const sourceOf = tileSources(artwork, tileset);
  for (const layer of tilemap.layers.filter((item) => item.visible)) {
    const cell = layer.cells[index] ?? 0;
    const key = cellKey(cell);
    const source = key === 0 ? null : (frameOf?.(layer.id, index, key) ?? sourceOf(key));
    if (source) blitTile({ target, targetWidth: tile.width, source, tile, origin: { x: 0, y: 0 }, cell });
  }
  return target;
};

export { composeMapCell };
