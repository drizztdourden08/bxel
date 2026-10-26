/* @layer renderer-app @kind logic */
import { tilesetImages } from '@bxel/document';
import type { Artwork, Tileset } from '@bxel/document';
import type { TilesetImageInput, TilesetTile } from '@bxel/formats';
import { MAP_EXPORT } from './map-export.constants';

const tileSheetInput = (artwork: Artwork, tileset: Tileset, extra: readonly TilesetTile[] = []): TilesetImageInput => ({
  tileWidth: tileset.tileWidth,
  tileHeight: tileset.tileHeight,
  columns: MAP_EXPORT.columns,
  spacing: MAP_EXPORT.spacing,
  margin: MAP_EXPORT.margin,
  tiles: [
    ...tilesetImages(artwork, tileset.id).map((tile) => ({
      key: tile.key,
      image: { data: Uint8ClampedArray.from(tile.rgba), width: tile.width, height: tile.height },
    })),
    ...extra,
  ],
});

export { tileSheetInput };
