/* @layer renderer-app @kind logic */
import type { Point, ShapeKind } from '@bxel/raster';
import { ratioSnap } from './ratio-snap';

const constrainCorner = (shape: ShapeKind, from: Point, to: Point): Point => {
  if (shape === 'line') return ratioSnap(from, to).to;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const side = Math.max(Math.abs(dx), Math.abs(dy));
  return { x: from.x + (dx < 0 ? -side : side), y: from.y + (dy < 0 ? -side : side) };
};

export { constrainCorner };
