/* @layer renderer-app @kind logic */
import type { Point, Rect, Sprite } from '@bxel/document';

const slot = (value: number, limit: number): number => Math.min(Math.max(value, 0), limit);

const sliceBox = (start: Point, end: Point, sprite: Sprite): Rect => {
  const left = slot(Math.min(start.x, end.x), sprite.width);
  const top = slot(Math.min(start.y, end.y), sprite.height);
  const right = slot(Math.max(start.x, end.x) + 1, sprite.width);
  const bottom = slot(Math.max(start.y, end.y) + 1, sprite.height);
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export { sliceBox };
