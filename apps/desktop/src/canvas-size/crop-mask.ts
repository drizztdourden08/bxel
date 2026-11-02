/* @layer renderer-app @kind logic */
import { emptyMask } from '@bxel/raster';
import type { MaskView, Rect } from '@bxel/raster';

const cropMask = (mask: MaskView, frame: Rect): MaskView => {
  const out = emptyMask(frame);
  for (let y = 0; y < frame.height; y += 1) {
    for (let x = 0; x < frame.width; x += 1) {
      out.bits[y * frame.width + x] = mask.bits[(frame.y + y) * mask.width + frame.x + x] ?? 0;
    }
  }
  return out;
};

export { cropMask };
