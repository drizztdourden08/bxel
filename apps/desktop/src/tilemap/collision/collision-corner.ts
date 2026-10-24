/* @layer renderer-app @kind logic */
import type { Point, Size } from '@bxel/document';

const collisionCorner = (offset: Point, scale: number, tile: Size): Point => ({
  x: Math.min(tile.width, Math.max(0, Math.round(offset.x / scale))),
  y: Math.min(tile.height, Math.max(0, Math.round(offset.y / scale))),
});

export { collisionCorner };
