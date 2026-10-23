/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { brushStamp } from './brush-stamp';
import { DEFAULT_BRUSH } from './brush.constants';
import { createWriter } from './create-writer';
import { ellipseFill } from './ellipse-fill';
import type { Corners, Rect } from './geometry.type';
import { mirrorPoints } from './mirror-points';
import type { ShapeOptions, ShapePass } from './paint.type';
import { rectFill } from './rect-fill';
import { shapeOutline } from './shape-outline';
import { stampAt } from './stamp-at';
import { writeSpans } from './write-spans';

const paintCorners = (pass: ShapePass, corners: Corners): void => {
  if (pass.filled) {
    writeSpans(pass.writer, pass.shape === 'rect' ? rectFill(corners) : ellipseFill(corners));
    return;
  }
  for (const point of shapeOutline(pass.shape, corners)) {
    stampAt(pass.writer, pass.stamp, point);
  }
};

const drawShape = (options: ShapeOptions): Rect | null => {
  const filled = options.filled === true && options.shape !== 'line';
  const stamp = brushStamp(options.brush ?? DEFAULT_BRUSH);
  const writer = createWriter(options);
  const pass: ShapePass = { writer, stamp, shape: options.shape, filled };
  const points = [options.from, options.to];
  const span = filled ? 1 : stamp.size;
  for (const [from, to] of mirrorPoints({ points, symmetry: options.symmetry ?? {}, span })) {
    if (from && to) {
      paintCorners(pass, { from, to });
    }
  }
  return boundsToRect(writer.bounds);
};

export { drawShape };
