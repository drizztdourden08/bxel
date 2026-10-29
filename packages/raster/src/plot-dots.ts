/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { brushStamp } from './brush-stamp';
import { createWriter } from './create-writer';
import type { Rect } from './geometry.type';
import { mirrorPoints } from './mirror-points';
import type { PlotOptions } from './paint.type';
import { stampAt } from './stamp-at';

const plotDots = (options: PlotOptions): Rect | null => {
  const stamp = brushStamp(options.brush);
  const writer = createWriter(options);
  for (const variant of mirrorPoints({ points: options.points, symmetry: options.symmetry ?? {}, span: stamp.size })) {
    for (const point of variant) {
      stampAt(writer, stamp, point);
    }
  }
  return boundsToRect(writer.bounds);
};

export { plotDots };
