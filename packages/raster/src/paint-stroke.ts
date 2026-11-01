/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { brushStamp } from './brush-stamp';
import { createWriter } from './create-writer';
import type { Point, Rect } from './geometry.type';
import { mirrorPoints } from './mirror-points';
import type { StrokeOptions } from './paint.type';
import { pixelPerfect } from './pixel-perfect';
import { stampAt } from './stamp-at';
import { strokePoints } from './stroke-points';

/** Keeps every spacing-th stamp of the path, so a tip is laid down once per spacing pixels. */
const spaced = (path: readonly Point[], spacing: number): readonly Point[] => (spacing > 1 ? path.filter((_, at) => at % spacing === 0) : path);

const paintStroke = (options: StrokeOptions): Rect | null => {
  const stamp = brushStamp(options.brush);
  const writer = createWriter(options);
  const variants = mirrorPoints({ points: options.points, symmetry: options.symmetry ?? {}, span: stamp.size });
  for (const variant of variants) {
    const path = strokePoints(variant);
    for (const point of spaced(options.pixelPerfect === true ? pixelPerfect(path) : path, options.brush.spacing ?? 1)) {
      stampAt(writer, stamp, point);
    }
  }
  return boundsToRect(writer.bounds);
};

export { paintStroke };
