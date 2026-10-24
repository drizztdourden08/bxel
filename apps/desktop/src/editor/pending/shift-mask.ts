/* @layer renderer-app @kind logic */
import { emptyMask } from '@bxel/raster';
import type { MaskView, Point } from '@bxel/raster';

const shiftMask = (mask: MaskView, offset: Point): MaskView => {
  const shifted = emptyMask(mask);
  for (const [at, bit] of mask.bits.entries()) {
    const x = (at % mask.width) + offset.x;
    const y = Math.floor(at / mask.width) + offset.y;
    if (bit !== 0 && x >= 0 && y >= 0 && x < mask.width && y < mask.height) shifted.bits[y * mask.width + x] = 1;
  }
  return shifted;
};

export { shiftMask };
