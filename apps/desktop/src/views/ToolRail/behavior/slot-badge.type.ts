/* @layer renderer-app @kind types */
import type { CombineMode, FillMode } from '@bxel/raster';

interface BadgeState {
  fillMode: FillMode;
  filled: boolean;
  mode: CombineMode;
}

export type { BadgeState };
