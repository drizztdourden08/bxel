/* @layer renderer-app @kind logic */
import type { Corners, Point } from '@bxel/raster';
import { constrainCorner } from '../constrain-corner';
import type { ShapeHold } from './selection.type';

const shapeCorners = (from: Point, to: Point, hold: ShapeHold): Corners => {
  const end = hold.square ? constrainCorner('rect', from, to) : to;
  if (!hold.centre) return { from, to: end };
  return { from: { x: from.x - (end.x - from.x), y: from.y - (end.y - from.y) }, to: end };
};

export { shapeCorners };
