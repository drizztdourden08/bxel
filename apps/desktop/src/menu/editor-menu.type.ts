/* @layer renderer-app @kind types */
import type { SpriteMode } from '../stores/sprite-store.type';
import type { TileEditMode } from '../stores/tilemap-store.type';
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
  mode: SpriteMode;
  tileMode: TileEditMode;
  collision: boolean;
  terrainBrush: boolean;
}

export type { EditorMenuState };
