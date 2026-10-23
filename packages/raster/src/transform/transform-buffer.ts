/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import { TRANSFORM_PLANS } from './transform.constants';
import type { Orientation } from './transform.type';
import { transformSize } from './transform-size';

const transformBuffer = (source: BufferView, orientation: Orientation): BufferView => {
  const { pixels, width, height } = source;
  const { to } = TRANSFORM_PLANS[orientation];
  const moved = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      moved[to(x, y, width, height)] = pixels[y * width + x] ?? 0;
    }
  }
  return { pixels: moved, ...transformSize(orientation, source) };
};

export { transformBuffer };
