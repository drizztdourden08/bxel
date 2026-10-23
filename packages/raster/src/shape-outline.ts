/* @layer core @kind logic */
import { ellipseOutline } from './ellipse-outline';
import type { Corners, Point } from './geometry.type';
import { linePoints } from './line-points';
import type { ShapeKind } from './paint.type';
import { rectOutline } from './rect-outline';

const shapeOutline = (shape: ShapeKind, corners: Corners): Point[] => {
  if (shape === 'rect') {
    return rectOutline(corners);
  }
  return shape === 'ellipse' ? ellipseOutline(corners) : linePoints(corners);
};

export { shapeOutline };
