/* @layer renderer-app @kind logic */
import { emptyMask } from '@bxel/raster';
import type { MaskView, PointMap } from '@bxel/raster';

const mapMask = (mask: MaskView, map: PointMap): MaskView => {
  const mapped = emptyMask(mask);
  for (const [at, bit] of mask.bits.entries()) {
    if (bit === 0) continue;
    const to = map({ x: at % mask.width, y: Math.floor(at / mask.width) });
    if (to.x >= 0 && to.y >= 0 && to.x < mask.width && to.y < mask.height) mapped.bits[to.y * mask.width + to.x] = 1;
  }
  return mapped;
};

export { mapMask };
