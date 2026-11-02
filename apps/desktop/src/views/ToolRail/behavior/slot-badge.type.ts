/* @layer renderer-app @kind types */
import type { CombineMode, FillMode } from '@bxel/raster';
import type { TileMode } from '../../../stores/view-store.type';

interface BadgeState {
  fillMode: FillMode;
  filled: boolean;
  mode: CombineMode;
  tiled: TileMode;
}

export type { BadgeState };
