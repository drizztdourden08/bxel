/* @layer core @kind logic */
import type { Rect } from './geometry.type';

const unionRects = (rects: readonly (Rect | null)[]): Rect | null => {
  let left = Number.MAX_SAFE_INTEGER;
  let top = Number.MAX_SAFE_INTEGER;
  let right = -1;
  let bottom = -1;
  for (const rect of rects) {
    if (rect) {
      left = Math.min(left, rect.x);
      top = Math.min(top, rect.y);
      right = Math.max(right, rect.x + rect.width);
      bottom = Math.max(bottom, rect.y + rect.height);
    }
  }
  return right < 0 ? null : { x: left, y: top, width: right - left, height: bottom - top };
};

export { unionRects };
