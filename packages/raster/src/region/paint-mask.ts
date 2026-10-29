/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import type { BufferView, MaskView } from '../buffer.type';
import { createBounds } from '../create-bounds';
import type { Rect } from '../geometry.type';
import { growBounds } from '../grow-bounds';

const paintMask = (target: BufferView, mask: MaskView, index: number): Rect | null => {
  const bounds = createBounds();
  for (const [at, bit] of mask.bits.entries()) {
    if (bit === 0 || target.pixels[at] === index) continue;
    target.pixels[at] = index;
    growBounds(bounds, at % target.width, Math.floor(at / target.width));
  }
  return boundsToRect(bounds);
};

export { paintMask };
