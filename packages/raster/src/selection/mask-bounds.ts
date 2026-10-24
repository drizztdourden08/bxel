/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { boundsToRect } from '../bounds-to-rect';
import { createBounds } from '../create-bounds';
import type { Rect } from '../geometry.type';
import { growBounds } from '../grow-bounds';

const maskBounds = (mask: MaskView): Rect | null => {
  const bounds = createBounds();
  for (const [at, value] of mask.bits.entries()) {
    if (value !== 0) {
      growBounds(bounds, at % mask.width, Math.floor(at / mask.width));
    }
  }
  return boundsToRect(bounds);
};

export { maskBounds };
