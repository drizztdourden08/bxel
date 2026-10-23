/* @layer core @kind logic */
import { rowStride } from './row-stride';

const packIndices = (
  indices: Uint8Array,
  width: number,
  height: number,
  depth: number,
): Uint8Array => {
  const stride = rowStride(width, depth);
  const out = new Uint8Array(stride * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const bit = x * depth;
      const at = y * stride + (bit >> 3);
      const shift = 8 - depth - (bit & 7);
      out[at] = (out[at] ?? 0) | ((indices[y * width + x] ?? 0) << shift);
    }
  }
  return out;
};

export { packIndices };
