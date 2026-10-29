/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import type { Clip } from './selection.type';

const fitClip = (clip: Clip, size: Size): { clip: Clip; cropped: boolean } => {
  if (clip.width <= size.width && clip.height <= size.height) return { clip, cropped: false };
  const width = Math.min(clip.width, size.width);
  const height = Math.min(clip.height, size.height);
  const pixels = new Uint8Array(width * height);
  const bits = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    pixels.set(clip.pixels.subarray(y * clip.width, y * clip.width + width), y * width);
    bits.set(clip.bits.subarray(y * clip.width, y * clip.width + width), y * width);
  }
  return { clip: { ...clip, width, height, pixels, bits }, cropped: true };
};

export { fitClip };
