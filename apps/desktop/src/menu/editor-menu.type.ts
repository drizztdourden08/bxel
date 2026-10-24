/* @layer renderer-app @kind types */
import type { SpriteMode } from '../stores/sprite-store.type';
import type { TileMode } from '../stores/view-store.type';

interface EditorMenuState {
  hasDocument: boolean;
  canUndo: boolean;
  canRedo: boolean;
  grid: boolean;
  tiled: TileMode;
  symmetryX: boolean;
  symmetryY: boolean;
  mode: SpriteMode;
}

export type { EditorMenuState };
