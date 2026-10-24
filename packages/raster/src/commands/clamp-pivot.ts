/* @layer core @kind logic */
import type { Pivot2, Size } from '@bxel/document';

const clampPivot = (pivot: Pivot2, size: Size): Pivot2 => ({
  x2: Math.min(2 * size.width, Math.max(0, pivot.x2)),
  y2: Math.min(2 * size.height, Math.max(0, pivot.y2)),
});

export { clampPivot };
