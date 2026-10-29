/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import type { Rect } from '../geometry.type';
import { mirrorPoints } from '../mirror-points';
import { stampAt } from '../stamp-at';
import { fillPath } from './fill-path';
import type { PathOptions } from './path.type';
import { pathOutline } from './path-outline';
import { pathPass } from './path-pass';
import { pathVertices } from './path-vertices';

const drawPath = (options: PathOptions): Rect | null => {
  const { stamp, writer, fillWriter, filled, outlined, span } = pathPass(options);
  for (const points of mirrorPoints({ points: options.points, symmetry: options.symmetry ?? {}, span })) {
    if (filled) {
      fillPath(fillWriter, pathVertices(options.kind, points));
    }
    if (outlined) {
      for (const point of pathOutline(options.kind, points, options.pixelPerfect)) {
        stampAt(writer, stamp, point);
      }
    }
  }
  return boundsToRect(writer.bounds);
};

export { drawPath };
