/* @layer core @kind logic */
import type { Corners, Extent } from './geometry.type';

const normalizeCorners = ({ from, to }: Corners): Extent => ({
  x0: Math.trunc(Math.min(from.x, to.x)),
  y0: Math.trunc(Math.min(from.y, to.y)),
  x1: Math.trunc(Math.max(from.x, to.x)),
  y1: Math.trunc(Math.max(from.y, to.y)),
});

export { normalizeCorners };
