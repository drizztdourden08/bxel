/* @layer renderer-app @kind logic */
import type { Rect, Size } from '@bxel/document';
import type { SliceHandle } from './slice-handle.type';

const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));

const resizeSliceRect = (rect: Rect, handle: SliceHandle, edge: { x: number; y: number }, bounds: Size): Rect => {
  let left = rect.x;
  let top = rect.y;
  let right = rect.x + rect.width;
  let bottom = rect.y + rect.height;
  if (handle.includes('w')) left = clamp(edge.x, 0, right - 1);
  if (handle.includes('e')) right = clamp(edge.x, left + 1, bounds.width);
  if (handle.includes('n')) top = clamp(edge.y, 0, bottom - 1);
  if (handle.includes('s')) bottom = clamp(edge.y, top + 1, bounds.height);
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export { resizeSliceRect };
