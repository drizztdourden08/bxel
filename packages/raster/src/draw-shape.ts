/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { ellipseFill } from './ellipse-fill';
import { evenLinePoints } from './even-line-points';
import type { Corners, Rect, Span } from './geometry.type';
import { mirrorPoints } from './mirror-points';
import type { ShapeOptions, ShapePass } from './paint.type';
import { rectFill } from './rect-fill';
import { roundedRect } from './rounded-rect';
import { shapeOutline } from './shape-outline';
import { shapePass } from './shape-pass';
import { spanOutline } from './span-outline';
import { stampAt } from './stamp-at';
import { writeSpans } from './write-spans';

const fillSpans = (pass: ShapePass, corners: Corners): Span[] => {
  if (pass.shape === 'rect') {
    return pass.radius > 0 ? roundedRect(corners, pass.radius) : rectFill(corners);
  }
  return ellipseFill(corners);
};

const outlinePoints = (pass: ShapePass, corners: Corners) => {
  if (pass.shape === 'rect' && pass.radius > 0) {
    return spanOutline(roundedRect(corners, pass.radius));
  }
  return pass.shape === 'line' && pass.evenSteps ? evenLinePoints(corners) : shapeOutline(pass.shape, corners);
};

const paintCorners = (pass: ShapePass, corners: Corners): void => {
  if (pass.filled) {
    writeSpans(pass.fillWriter, fillSpans(pass, corners));
    if (!pass.outlined) {
      return;
    }
  }
  for (const point of outlinePoints(pass, corners)) {
    stampAt(pass.writer, pass.stamp, point);
  }
};

const drawShape = (options: ShapeOptions): Rect | null => {
  const { pass, span } = shapePass(options);
  const points = [options.from, options.to];
  for (const [from, to] of mirrorPoints({ points, symmetry: options.symmetry ?? {}, span })) {
    if (from && to) {
      paintCorners(pass, { from, to });
    }
  }
  return boundsToRect(pass.writer.bounds);
};

export { drawShape };
