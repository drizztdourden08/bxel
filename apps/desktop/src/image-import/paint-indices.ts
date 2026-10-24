/* @layer renderer-app @kind logic */
import { RGBA_BYTES } from './image-import.constants';

const paintIndices = (pixels: Uint8Array, table: Uint8ClampedArray): Uint8ClampedArray => {
  const out = new Uint8ClampedArray(pixels.length * RGBA_BYTES);
  for (const [position, index] of pixels.entries()) {
    out.set(table.subarray(index * RGBA_BYTES, (index + 1) * RGBA_BYTES), position * RGBA_BYTES);
  }
  return out;
};

export { paintIndices };
