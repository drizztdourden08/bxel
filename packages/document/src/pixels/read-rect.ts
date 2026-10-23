/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';

const readRect = (source: Uint8Array, stride: number, rect: Rect): Uint8Array => {
  const out = new Uint8Array(rect.width * rect.height);
  for (let row = 0; row < rect.height; row += 1) {
    const start = (rect.y + row) * stride + rect.x;
    out.set(source.subarray(start, start + rect.width), row * rect.width);
  }
  return out;
};

export { readRect };
