/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { brushStamp } from './brush-stamp';
import { DEFAULT_BRUSH } from './brush.constants';
import { createWriter } from './create-writer';
import { ellipseFill } from './ellipse-fill';
import { evenLinePoints } from './even-line-points';
import type { Corners, Rect, Span } from './geometry.type';
import { mirrorPoints } from './mirror-points';
import type { PixelWriter, ShapeOptions, ShapePass } from './paint.type';
import { rectFill } from './rect-fill';
import { roundedRect } from './rounded-rect';
import { shapeOutline } from './shape-outline';
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

const fillWriterOf = (writer: PixelWriter, fillIndex: number | undefined): PixelWriter =>
  fillIndex === undefined ? writer : { ...writer, index: fillIndex & 255 };

const drawShape = (options: ShapeOptions): Rect | null => {
  const filled = options.filled === true && options.shape !== 'line';
  const stamp = brushStamp(options.brush ?? DEFAULT_BRUSH);
  const writer = createWriter(options);
  const outlined = !filled || (options.fillIndex !== undefined && options.fillIndex !== options.index);
  const pass: ShapePass = {
    writer,
    fillWriter: fillWriterOf(writer, options.fillIndex),
    stamp,
    shape: options.shape,
    filled,
    outlined,
    radius: options.radius ?? 0,
    evenSteps: options.evenSteps === true,
  };
  const points = [options.from, options.to];
  const span = filled && !outlined ? 1 : stamp.size;
  for (const [from, to] of mirrorPoints({ points, symmetry: options.symmetry ?? {}, span })) {
    if (from && to) {
      paintCorners(pass, { from, to });
    }
  }
  return boundsToRect(writer.bounds);
};

export { drawShape };
