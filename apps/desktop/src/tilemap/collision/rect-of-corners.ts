/* @layer renderer-app @kind logic */
import type { Point, TileCollision } from '@bxel/document';

const rectOfCorners = (from: Point, to: Point): TileCollision | null => {
  const width = Math.abs(to.x - from.x);
  const height = Math.abs(to.y - from.y);
  if (width < 1 || height < 1) return null;
  return { kind: 'rect', x: Math.min(from.x, to.x), y: Math.min(from.y, to.y), width, height };
};

export { rectOfCorners };
