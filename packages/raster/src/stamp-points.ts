/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import type { Brush } from './brush.type';
import { brushStamp } from './brush-stamp';
import { createWriter } from './create-writer';
import type { Point, Rect } from './geometry.type';
import type { PaintTarget } from './paint.type';
import { stampAt } from './stamp-at';

const stampPoints = (paint: PaintTarget, brush: Brush, points: readonly Point[]): Rect | null => {
  const stamp = brushStamp(brush);
  const writer = createWriter(paint);
  for (const point of points) {
    stampAt(writer, stamp, point);
  }
  return boundsToRect(writer.bounds);
};

export { stampPoints };
