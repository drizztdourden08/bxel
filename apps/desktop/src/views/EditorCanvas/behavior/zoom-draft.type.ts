/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';

interface ZoomDraft {
  from: Point;
  to: Point;
}

export type { ZoomDraft };
