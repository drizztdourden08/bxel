/* @layer renderer-app @kind logic */
import { CHANNELS, GAP_COLOUR, OVERLAY_COLOURS } from './tileset-overlay.constants';
import type { FilledTile, SlotFrame } from './tileset-image.type';
import { tintPixel } from './tint-pixel';
import { tintTile } from './tint-tile';

const paintTilePixel = (data: Uint8ClampedArray, frame: SlotFrame, at: { readonly x: number; readonly y: number }, filled: FilledTile | null): void => {
  const { x, y } = at;
  const offset = ((frame.originY + y) * frame.width + frame.originX + x) * CHANNELS;
  if (filled === null) {
    data.set(GAP_COLOUR, offset);
    return;
  }
  const { tile, image } = filled;
  const source = (y * frame.tileWidth + x) * CHANNELS;
  data.set(image.rgba.subarray(source, source + CHANNELS), offset);
  if (frame.overlay === 'collision') tintTile(data, offset, { tile, layers: frame.layers, size: { width: frame.tileWidth, height: frame.tileHeight }, x, y });
  const set = frame.overlay === 'terrain' ? frame.terrainOf.get(tile.key) : undefined;
  if (set !== undefined) tintPixel(data, offset, OVERLAY_COLOURS[set % OVERLAY_COLOURS.length] ?? [255, 80, 80]);
};

export { paintTilePixel };
