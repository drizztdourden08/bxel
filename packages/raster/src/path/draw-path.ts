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
  const fillWriter = options.fillIndex === undefined ? writer : { ...writer, index: options.fillIndex & 255 };
  const filled = options.filled === true;
  const outlined = !filled || (options.fillIndex !== undefined && options.fillIndex !== options.index);
  const span = filled && !outlined ? 1 : stamp.size;
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
