/* @layer renderer-app @kind logic */
import { tileLayout, tilesetImages } from '@bxel/document';
import type { Artwork, Tileset } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import { paintTileSlot } from './paint-tile-slot';
import { terrainIndexOf } from './terrain-index-of';
import type { TilesetOverlay } from './tool-input.type';
import { CHANNELS } from './tileset-overlay.constants';

const tilesetImage = (artwork: Artwork, tileset: Tileset, overlay: TilesetOverlay): RgbaImage => {
  const layout = tileLayout(tileset);
  const { tileWidth, tileHeight } = tileset;
  const width = layout.columns * tileWidth;
  const height = layout.rows * tileHeight;
  const data = new Uint8ClampedArray(width * height * CHANNELS);
  const images = new Map(tilesetImages(artwork, tileset.id).map((image) => [image.key, image]));
  const layers = tileset.collisionLayers ?? ['solid'];
  const terrainOf = terrainIndexOf(tileset);
  layout.slots.forEach((tile, slot) => {
    const originX = (slot % layout.columns) * tileWidth;
    const originY = Math.floor(slot / layout.columns) * tileHeight;
    const image = tile ? images.get(tile.key) : undefined;
    const filled = tile && image ? { tile, image } : null;
    paintTileSlot(data, { width, tileWidth, tileHeight, originX, originY, overlay, layers, terrainOf }, filled);
  });
  return { data, width, height };
};

export { tilesetImage };
