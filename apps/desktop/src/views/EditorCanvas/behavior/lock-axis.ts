/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';

const lockAxis = (delta: Point, locked: boolean): Point => {
  if (!locked) return delta;
  return Math.abs(delta.x) >= Math.abs(delta.y) ? { x: delta.x, y: 0 } : { x: 0, y: delta.y };
};

export { lockAxis };
