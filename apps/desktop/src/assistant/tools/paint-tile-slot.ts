/* @layer renderer-app @kind logic */
import { drawTileKey } from './draw-tile-key';
import { paintTilePixel } from './paint-tile-pixel';
import type { FilledTile, SlotFrame } from './tileset-image.type';

const paintTileSlot = (data: Uint8ClampedArray, frame: SlotFrame, filled: FilledTile | null): void => {
  for (let y = 0; y < frame.tileHeight; y += 1) {
    for (let x = 0; x < frame.tileWidth; x += 1) paintTilePixel(data, frame, { x, y }, filled);
  }
  if (filled !== null && frame.overlay === 'keys') {
    const { width, originX, originY, tileWidth, tileHeight } = frame;
    drawTileKey(data, { width, originX, originY, tileWidth, tileHeight }, filled.tile.key);
  }
};

export { paintTileSlot };
