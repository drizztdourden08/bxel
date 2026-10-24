/* @layer renderer-app @kind types */
import type { TileMode } from '../stores/view-store.type';

interface EditorMenuState {
  hasDocument: boolean;
  canUndo: boolean;
  canRedo: boolean;
  grid: boolean;
  gridMajor: boolean;
  gridTile: boolean;
  rulers: boolean;
  tiled: TileMode;
  symmetryX: boolean;
  symmetryY: boolean;
}

export type { EditorMenuState };
