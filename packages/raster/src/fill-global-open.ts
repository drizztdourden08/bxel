/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { createBounds } from './create-bounds';
import type { FillPlan } from './fill.type';
import type { Rect } from './geometry.type';

const fillGlobalOpen = (plan: FillPlan): Rect | null => {
  const { pixels, width, height } = plan.target;
  const { match, index } = plan;
  const bounds = createBounds();
  for (let y = 0; y < height; y++) {
    const base = y * width;
    let first = -1;
    let last = -1;
    for (let x = 0; x < width; x++) {
      if (pixels[base + x] === match) {
        pixels[base + x] = index;
        first = first < 0 ? x : first;
        last = x;
      }
    }
    if (last >= 0) {
      bounds.minX = Math.min(bounds.minX, first);
      bounds.maxX = Math.max(bounds.maxX, last);
      bounds.minY = Math.min(bounds.minY, y);
      bounds.maxY = Math.max(bounds.maxY, y);
    }
  }
  return boundsToRect(bounds);
};

export { fillGlobalOpen };
