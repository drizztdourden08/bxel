/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { MaskPatch } from './mask-patch.type';

const maskPatch = (mask: MaskView, index: number): MaskPatch | null => {
  const rect = maskBounds(mask);
  if (!rect) return null;
  const pixels = new Uint8Array(rect.width * rect.height);
  for (let y = 0; y < rect.height; y++) {
    for (let x = 0; x < rect.width; x++) {
      if ((mask.bits[(rect.y + y) * mask.width + rect.x + x] ?? 0) !== 0) pixels[y * rect.width + x] = index;
    }
  }
  return { rect, pixels };
};

export { maskPatch };
