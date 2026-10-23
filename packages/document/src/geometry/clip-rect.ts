/* @layer core @kind logic */
import type { Rect, Size } from '../model/geometry.type';

const clipRect = (rect: Rect, bounds: Size): Rect | null => {
  const left = Math.max(rect.x, 0);
  const top = Math.max(rect.y, 0);
  const right = Math.min(rect.x + rect.width, bounds.width);
  const bottom = Math.min(rect.y + rect.height, bounds.height);
  if (right <= left || bottom <= top) return null;
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export { clipRect };
