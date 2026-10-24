/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import type { BufferView, MaskView } from '../buffer.type';
import { createBounds } from '../create-bounds';
import type { Rect } from '../geometry.type';
import { growBounds } from '../grow-bounds';
import { maskAllows } from '../mask-allows';

const clearRegion = (target: BufferView, mask?: MaskView | null): Rect | null => {
  const bounds = createBounds();
  for (const [at, value] of target.pixels.entries()) {
    const x = at % target.width;
    const y = Math.floor(at / target.width);
    if (value !== 0 && maskAllows(mask, x, y)) {
      target.pixels[at] = 0;
      growBounds(bounds, x, y);
    }
  }
  return boundsToRect(bounds);
};

export { clearRegion };
