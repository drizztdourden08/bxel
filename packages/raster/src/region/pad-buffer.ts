/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import type { Rect } from '../geometry.type';

const padBuffer = (source: BufferView, frame: Rect): BufferView => {
  const pixels = new Uint8Array(frame.width * frame.height);
  for (let y = 0; y < source.height; y++) {
    pixels.set(source.pixels.subarray(y * source.width, (y + 1) * source.width), (y - frame.y) * frame.width - frame.x);
  }
  return { pixels, width: frame.width, height: frame.height };
};

export { padBuffer };
