/* @layer renderer-app @kind types */
import type { TileMode, ViewToggles } from '../stores/view-store.type';
import type { BxelContext } from '../ui-context/bxel-context.type';

interface EditorMenuState extends ViewToggles {
  context: BxelContext;
  tiled: TileMode;
  symmetryX: boolean;
  symmetryY: boolean;
  settings: string;
  collision: boolean;
  terrainBrush: boolean;
  animateTiles: boolean;
}

export type { EditorMenuState };
