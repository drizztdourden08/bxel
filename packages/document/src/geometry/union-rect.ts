/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';

const unionRect = (first: Rect, second: Rect): Rect => {
  const left = Math.min(first.x, second.x);
  const top = Math.min(first.y, second.y);
  const right = Math.max(first.x + first.width, second.x + second.width);
  const bottom = Math.max(first.y + first.height, second.y + second.height);
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export { unionRect };
