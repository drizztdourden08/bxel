/* @layer renderer-app @kind types */
import type { Corners, ShapeKind } from '@bxel/raster';

interface QuickShape {
  shape: ShapeKind;
  corners: Corners;
}

export type { QuickShape };
