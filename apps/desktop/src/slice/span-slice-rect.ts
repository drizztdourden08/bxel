/* @layer renderer-app @kind logic */
import type { Rect, Size } from '@bxel/document';

const clamp = (value: number, high: number): number => Math.min(high, Math.max(0, value));

const spanSliceRect = (from: { x: number; y: number }, to: { x: number; y: number }, bounds: Size): Rect => {
  const left = clamp(Math.min(from.x, to.x), bounds.width);
  const top = clamp(Math.min(from.y, to.y), bounds.height);
  return { x: left, y: top, width: clamp(Math.max(from.x, to.x), bounds.width) - left, height: clamp(Math.max(from.y, to.y), bounds.height) - top };
};

export { spanSliceRect };
