/* @layer renderer-app @kind types */
import type { CombineMode, FillMode, ShapeKind } from '@bxel/raster';

interface BadgeState {
  fillMode: FillMode;
  filled: boolean;
  shape: ShapeKind;
  mode: CombineMode;
}

export type { BadgeState };
