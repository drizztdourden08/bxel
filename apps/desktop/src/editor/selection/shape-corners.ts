/* @layer renderer-app @kind logic */
import type { Corners, Point } from '@bxel/raster';
import type { ShapeHold } from './selection.type';

const squared = (from: Point, to: Point): Point => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const side = Math.max(Math.abs(dx), Math.abs(dy));
  return { x: from.x + (dx < 0 ? -side : side), y: from.y + (dy < 0 ? -side : side) };
};

const shapeCorners = (from: Point, to: Point, hold: ShapeHold): Corners => {
  const end = hold.square ? squared(from, to) : to;
  if (!hold.centre) return { from, to: end };
  return { from: { x: from.x - (end.x - from.x), y: from.y - (end.y - from.y) }, to: end };
};

export { shapeCorners };
