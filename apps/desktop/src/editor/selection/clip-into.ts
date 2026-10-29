/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { Clip } from './selection.type';

const clipInto = (clip: Clip, mask: MaskView): Clip => {
  const box = maskBounds(mask);
  if (!box) return clip;
  const bits = Uint8Array.from(clip.bits, (bit, at) => {
    const x = box.x + (at % clip.width);
    const y = box.y + Math.floor(at / clip.width);
    return bit !== 0 && x < mask.width && y < mask.height && (mask.bits[y * mask.width + x] ?? 0) !== 0 ? 1 : 0;
  });
  const pixels = Uint8Array.from(clip.pixels, (value, at) => (bits[at] === 0 ? 0 : value));
  return { ...clip, origin: { x: box.x, y: box.y }, bits, pixels };
};

export { clipInto };
