/* @layer renderer-app @kind types */
import type { TileMode } from '../stores/view-store.type';
import type { BxelContext } from '../ui-context/bxel-context.type';

interface EditorMenuState {
  context: BxelContext;
  grid: boolean;
  gridMajor: boolean;
  gridTile: boolean;
  guides: boolean;
  rulers: boolean;
  snap: boolean;
  slices: boolean;
  hideOverlays: boolean;
  mirror: boolean;
  loupe: boolean;
  fullscreen: boolean;
  split: boolean;
  lockGuides: boolean;
  tiled: TileMode;
  symmetryX: boolean;
  symmetryY: boolean;
  settings: string;
  collision: boolean;
  terrainBrush: boolean;
  animateTiles: boolean;
}

export type { EditorMenuState };
