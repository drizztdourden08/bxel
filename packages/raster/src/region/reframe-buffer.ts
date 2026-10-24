/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import type { Rect } from '../geometry.type';

const reframeBuffer = (source: BufferView, frame: Rect): BufferView => {
  const pixels = new Uint8Array(frame.width * frame.height);
  const from = Math.max(0, frame.x);
  const to = Math.min(source.width, frame.x + frame.width);
  if (to > from) {
    for (let y = 0; y < frame.height; y++) {
      const row = y + frame.y;
      if (row >= 0 && row < source.height) {
        pixels.set(source.pixels.subarray(row * source.width + from, row * source.width + to), y * frame.width + (from - frame.x));
      }
    }
  }
  return { pixels, width: frame.width, height: frame.height };
};

export { reframeBuffer };
