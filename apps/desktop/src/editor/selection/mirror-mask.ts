/* @layer renderer-app @kind logic */
import { emptyMask, symmetryMaps } from '@bxel/raster';
import type { MaskView, Point, Symmetry } from '@bxel/raster';

const inside = (mask: MaskView, point: Point): boolean => point.x >= 0 && point.y >= 0 && point.x < mask.width && point.y < mask.height;

const mirrorMask = (mask: MaskView, symmetry: Symmetry): MaskView => {
  const maps = symmetryMaps(symmetry, 1);
  if (maps.length < 2) return mask;
  const mirrored = emptyMask(mask);
  for (const [at, bit] of mask.bits.entries()) {
    if (bit === 0) continue;
    const point = { x: at % mask.width, y: Math.floor(at / mask.width) };
    for (const map of maps) {
      const to = map(point);
      if (inside(mask, to)) mirrored.bits[to.y * mask.width + to.x] = 1;
    }
  }
  return mirrored;
};

export { mirrorMask };
