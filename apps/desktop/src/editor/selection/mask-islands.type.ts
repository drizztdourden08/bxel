/* @layer renderer-app @kind types */
import type { MaskView, Rect } from '@bxel/raster';

interface MaskIsland {
  mask: MaskView;
  box: Rect;
}

export type { MaskIsland };
