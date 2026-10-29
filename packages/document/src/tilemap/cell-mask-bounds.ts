/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';

const cellMaskBounds = (mask: Uint8Array, columns: number): Rect | null => {
  let left = columns;
  let top = Number.POSITIVE_INFINITY;
  let right = -1;
  let bottom = -1;
  mask.forEach((bit, index) => {
    if (bit !== 1) return;
    const x = index % columns;
    const y = (index - x) / columns;
    left = Math.min(left, x);
    right = Math.max(right, x);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  });
  return right < 0 ? null : { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
};

export { cellMaskBounds };
