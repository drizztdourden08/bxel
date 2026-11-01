/* @layer renderer-app @kind types */
import type { Connectivity, MaskView, Point, Size } from '@bxel/raster';

interface QuickFill {
  base: MaskView | null;
  size: Size;
  seed: Point;
  erase: boolean;
  connectivity: Connectivity;
}

export type { QuickFill };
