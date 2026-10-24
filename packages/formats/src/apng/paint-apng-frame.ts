/* @layer core @kind logic */
import { blendOver } from '../pixels/blend-over';
import { BLEND } from '../pixels/blend.constants';
import type { Box } from '../pixels/box.type';
import type { RgbaImage } from '../png.type';
import { APNG_OP } from './apng-op.constants';

const paintApngFrame = (
  target: RgbaImage,
  region: Box,
  pixels: Uint8ClampedArray,
  blend: number,
): void => {
  for (let row = 0; row < region.height; row += 1) {
    for (let col = 0; col < region.width; col += 1) {
      const from = (row * region.width + col) * BLEND.CHANNELS;
      const at = ((region.y + row) * target.width + region.x + col) * BLEND.CHANNELS;
      if (blend === APNG_OP.BLEND_OVER) {
        blendOver(target.data, at, pixels, from);
      } else {
        target.data.set(pixels.subarray(from, from + BLEND.CHANNELS), at);
      }
    }
  }
};

export { paintApngFrame };
