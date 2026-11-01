/* @layer renderer-app @kind logic */
import { tileLayout, tileShapes, tilesetImages } from '@bxel/document';
import type { Artwork, Tile, Tileset } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import { drawTileKey } from './draw-tile-key';
import { shapeCovers } from './shape-covers';
import { terrainIndexOf } from './terrain-index-of';
import type { TilesetOverlay } from './tool-input.type';
import { CHANNELS, GAP_COLOUR, OVERLAY_ALPHA, OVERLAY_COLOURS } from './tileset-overlay.constants';

const tint = (data: Uint8ClampedArray, at: number, colour: readonly [number, number, number]): void => {
  for (let channel = 0; channel < 3; channel += 1) {
    data[at + channel] = Math.round((data[at + channel] ?? 0) * (1 - OVERLAY_ALPHA) + (colour[channel] ?? 0) * OVERLAY_ALPHA);
  }
  data[at + 3] = 255;
};

const tintTile = (data: Uint8ClampedArray, at: number, input: { tile: Tile; layers: readonly string[]; size: { width: number; height: number }; x: number; y: number }): void => {
  for (const shape of tileShapes(input.tile)) {
    if (!shapeCovers(shape, input.size, { x: input.x, y: input.y })) continue;
    const colour = OVERLAY_COLOURS[Math.max(0, input.layers.indexOf(shape.layer)) % OVERLAY_COLOURS.length] ?? [255, 80, 80];
    tint(data, at, colour);
  }
};

const tilesetImage = (artwork: Artwork, tileset: Tileset, overlay: TilesetOverlay): RgbaImage => {
  const layout = tileLayout(tileset);
  const { tileWidth: tw, tileHeight: th } = tileset;
  const width = layout.columns * tw;
  const height = layout.rows * th;
  const data = new Uint8ClampedArray(width * height * CHANNELS);
  const images = new Map(tilesetImages(artwork, tileset.id).map((image) => [image.key, image]));
  const layers = tileset.collisionLayers ?? ['solid'];
  const terrainOf = terrainIndexOf(tileset);
  layout.slots.forEach((tile, slot) => {
    const originX = (slot % layout.columns) * tw;
    const originY = Math.floor(slot / layout.columns) * th;
    const image = tile ? images.get(tile.key) : undefined;
    for (let y = 0; y < th; y += 1) {
      for (let x = 0; x < tw; x += 1) {
        const at = ((originY + y) * width + originX + x) * CHANNELS;
        if (!tile || !image) data.set(GAP_COLOUR, at);
        else data.set(image.rgba.subarray((y * tw + x) * CHANNELS, (y * tw + x + 1) * CHANNELS), at);
        if (tile && image && overlay === 'collision') tintTile(data, at, { tile, layers, size: { width: tw, height: th }, x, y });
        const set = tile && image && overlay === 'terrain' ? terrainOf.get(tile.key) : undefined;
        if (set !== undefined) tint(data, at, OVERLAY_COLOURS[set % OVERLAY_COLOURS.length] ?? [255, 80, 80]);
      }
    }
    if (tile && image && overlay === 'keys') drawTileKey(data, { width, originX, originY, tileWidth: tw, tileHeight: th }, tile.key);
  });
  return { data, width, height };
};

export { tilesetImage };
