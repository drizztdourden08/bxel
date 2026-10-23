/* @layer core @kind logic */
import { PIXEL_WRITERS } from './pixel-writers.constants';
import type { ExpandContext } from './png-decode.type';
import { rowStride } from './row-stride';

const expandPixels = (context: ExpandContext): Uint8ClampedArray | undefined => {
  const { width, height, colorType, bitsPerPixel } = context.header;
  const write = PIXEL_WRITERS[colorType]?.(context);
  if (!write) return undefined;
  const stride = rowStride(width, bitsPerPixel);
  const out = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!write(y * stride, x, out, (y * width + x) * 4)) return undefined;
    }
  }
  return out;
};

export { expandPixels };
