/* @layer renderer-app @kind logic */
import type { Point, ShapeKind } from '@bxel/raster';
import { LINE_SLOPE } from './tools.constants';

const constrainCorner = (shape: ShapeKind, from: Point, to: Point): Point => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const across = Math.abs(dx);
  const down = Math.abs(dy);
  const side = Math.max(across, down);
  const square = { x: from.x + (dx < 0 ? -side : side), y: from.y + (dy < 0 ? -side : side) };
  if (shape !== 'line') return square;
  if (across >= LINE_SLOPE * down) return { x: to.x, y: from.y };
  return down >= LINE_SLOPE * across ? { x: from.x, y: to.y } : square;
};

export { constrainCorner };
