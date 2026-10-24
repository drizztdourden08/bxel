/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { brushStamp } from '../brush-stamp';
import { DEFAULT_BRUSH } from '../brush.constants';
import { createWriter } from '../create-writer';
import type { Rect } from '../geometry.type';
import { mirrorPoints } from '../mirror-points';
import { stampAt } from '../stamp-at';
import { fillPath } from './fill-path';
import type { PathOptions } from './path.type';
import { pathOutline } from './path-outline';
import { pathVertices } from './path-vertices';

const drawPath = (options: PathOptions): Rect | null => {
  const stamp = brushStamp(options.brush ?? DEFAULT_BRUSH);
  const writer = createWriter(options);
  const filled = options.filled === true;
  const span = filled ? 1 : stamp.size;
  for (const points of mirrorPoints({ points: options.points, symmetry: options.symmetry ?? {}, span })) {
    if (filled) {
      fillPath(writer, pathVertices(options.kind, points));
    } else {
      for (const point of pathOutline(options.kind, points)) {
        stampAt(writer, stamp, point);
      }
    }
  }
  return boundsToRect(writer.bounds);
};

export { drawPath };
