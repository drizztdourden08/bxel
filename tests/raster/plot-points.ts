/* @layer tests @kind logic */
import type { Point } from '../../packages/raster/src/index';
import { blankBuffer } from './blank-buffer';
import { toRows } from './to-rows';

const plotPoints = (points: readonly Point[], width: number, height: number): string[] => {
  const view = blankBuffer(width, height);
  for (const point of points) {
    view.pixels[point.y * width + point.x] = 1;
  }
  return toRows(view);
};

export { plotPoints };
