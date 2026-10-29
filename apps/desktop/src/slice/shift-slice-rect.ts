/* @layer renderer-app @kind logic */
import type { Rect, Size } from '@bxel/document';

const shiftSliceRect = (rect: Rect, by: { x: number; y: number }, bounds: Size): Rect => ({
  ...rect,
  x: Math.min(bounds.width - rect.width, Math.max(0, rect.x + by.x)),
  y: Math.min(bounds.height - rect.height, Math.max(0, rect.y + by.y)),
});

export { shiftSliceRect };
