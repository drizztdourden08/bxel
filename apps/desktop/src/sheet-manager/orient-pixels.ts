/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';
import type { Orientation } from './identical.type';

const orientPixels = (pixels: Uint8Array, size: Size, orientation: Orientation): Uint8Array => {
  if (orientation === 'none') return pixels;
  const { width, height } = size;
  const flipX = orientation === 'horizontal' || orientation === 'both';
  const flipY = orientation === 'vertical' || orientation === 'both';
  const out = new Uint8Array(pixels.length);
  for (let y = 0; y < height; y += 1) {
    const row = (flipY ? height - 1 - y : y) * width;
    for (let x = 0; x < width; x += 1) out[y * width + x] = pixels[row + (flipX ? width - 1 - x : x)] ?? 0;
  }
  return out;
};

export { orientPixels };
