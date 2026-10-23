/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { brushStamp } from './brush-stamp';
import { createWriter } from './create-writer';
import type { Rect } from './geometry.type';
import { mirrorPoints } from './mirror-points';
import type { StrokeOptions } from './paint.type';
import { pixelPerfect } from './pixel-perfect';
import { stampAt } from './stamp-at';
import { strokePoints } from './stroke-points';

const paintStroke = (options: StrokeOptions): Rect | null => {
  const stamp = brushStamp(options.brush);
  const writer = createWriter(options);
  const variants = mirrorPoints({ points: options.points, symmetry: options.symmetry ?? {}, span: stamp.size });
  for (const variant of variants) {
    const path = strokePoints(variant);
    for (const point of options.pixelPerfect === true ? pixelPerfect(path) : path) {
      stampAt(writer, stamp, point);
    }
  }
  return boundsToRect(writer.bounds);
};

export { paintStroke };
