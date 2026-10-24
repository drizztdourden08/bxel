/* @layer renderer-app @kind logic */
import { emptyMask } from '@bxel/raster';
import type { MaskView, Point, Size } from '@bxel/raster';
import type { Clip } from '../selection/selection.type';
import { clipRect } from './clip-rect';

const placeClip = (clip: Clip, offset: Point, size: Size): MaskView => {
  const mask = emptyMask(size);
  const rect = clipRect(clip, offset);
  for (const [at, bit] of clip.bits.entries()) {
    const x = rect.x + (at % clip.width);
    const y = rect.y + Math.floor(at / clip.width);
    if (bit !== 0 && x >= 0 && y >= 0 && x < size.width && y < size.height) mask.bits[y * size.width + x] = 1;
  }
  return mask;
};

export { placeClip };
