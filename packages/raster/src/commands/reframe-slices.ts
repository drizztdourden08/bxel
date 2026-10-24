/* @layer core @kind logic */
import type { Rect, Slice } from '@bxel/document';

const clipTo = (rect: Rect, width: number, height: number): Rect | null => {
  const x0 = Math.max(0, rect.x);
  const y0 = Math.max(0, rect.y);
  const x1 = Math.min(width, rect.x + rect.width);
  const y1 = Math.min(height, rect.y + rect.height);
  return x1 > x0 && y1 > y0 ? { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } : null;
};

const sameRect = (a: Rect, b: Rect): boolean => a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

const reframeSlices = (slices: readonly Slice[], frame: Rect): Slice[] =>
  slices.flatMap((slice) => {
    const moved = { ...slice.rect, x: slice.rect.x - frame.x, y: slice.rect.y - frame.y };
    const kept = clipTo(moved, frame.width, frame.height);
    if (!kept) return [];
    return [sameRect(kept, moved) ? { ...slice, rect: kept } : { ...slice, rect: kept, pivot: null, center: null }];
  });

export { reframeSlices };
