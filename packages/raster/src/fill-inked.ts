/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { createWriter } from './create-writer';
import { fillRegion } from './fill-region';
import type { RegionFill } from './fill-region.type';
import type { Rect } from './geometry.type';
import { writePixel } from './write-pixel';

const fillInked = (options: RegionFill): Rect | null => {
  const { target } = options;
  const region = fillRegion(options);
  const writer = createWriter({ target, index: options.index, mask: options.mask, wrap: options.wrap, ink: options.ink });
  for (const [at, mark] of region.entries()) {
    if (mark !== 0) writePixel(writer, at % target.width, Math.floor(at / target.width));
  }
  return boundsToRect(writer.bounds);
};

export { fillInked };
