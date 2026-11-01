/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import type { Tile } from '@bxel/document';
import { shapeCovers } from './shape-covers';
import { OVERLAY_COLOURS } from './tileset-overlay.constants';
import { tintPixel } from './tint-pixel';

const tintTile = (data: Uint8ClampedArray, at: number, input: { tile: Tile; layers: readonly string[]; size: { width: number; height: number }; x: number; y: number }): void => {
  for (const shape of tileShapes(input.tile)) {
    if (!shapeCovers(shape, input.size, { x: input.x, y: input.y })) continue;
    const colour = OVERLAY_COLOURS[Math.max(0, input.layers.indexOf(shape.layer)) % OVERLAY_COLOURS.length] ?? [255, 80, 80];
    tintPixel(data, at, colour);
  }
};

export { tintTile };
