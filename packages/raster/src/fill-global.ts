/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { createWriter } from './create-writer';
import { fillGlobalOpen } from './fill-global-open';
import type { FillPlan } from './fill.type';
import type { Rect } from './geometry.type';
import { writePixel } from './write-pixel';

const fillGlobal = (plan: FillPlan): Rect | null => {
  if (plan.mask === null) {
    return fillGlobalOpen(plan);
  }
  const writer = createWriter(plan);
  const { pixels, width, height } = plan.target;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[y * width + x] === plan.match) {
        writePixel(writer, x, y);
      }
    }
  }
  return boundsToRect(writer.bounds);
};

export { fillGlobal };
