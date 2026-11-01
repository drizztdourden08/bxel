/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';

interface BrushResizeDraft {
  readonly at: Point;
  readonly startX: number;
  readonly startSize: number;
  moved: boolean;
}

export type { BrushResizeDraft };
