/* @layer renderer-app @kind logic */
import type { Point, Rect } from '@bxel/document';

const spanRect = (from: Point, to: Point): Rect => ({
  x: Math.min(from.x, to.x),
  y: Math.min(from.y, to.y),
  width: Math.abs(to.x - from.x) + 1,
  height: Math.abs(to.y - from.y) + 1,
});

export { spanRect };
