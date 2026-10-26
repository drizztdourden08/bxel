/* @layer renderer-app @kind types */
import type { AssetKind } from '@bxel/document';
import type { TileEditMode } from '../stores/tilemap-store.type';
import type { TileMode } from '../stores/view-store.type';
import type { Surface } from '../surface/surface.type';

interface EditorMenuState {
  hasDocument: boolean;
  canUndo: boolean;
  canRedo: boolean;
  grid: boolean;
  gridMajor: boolean;
  gridTile: boolean;
  guides: boolean;
  rulers: boolean;
  tiled: TileMode;
  symmetryX: boolean;
  symmetryY: boolean;
  surface: Surface;
  kind: AssetKind | null;
  isolated: boolean;
  settings: string;
  tileMode: TileEditMode;
  collision: boolean;
  terrainBrush: boolean;
}

export type { EditorMenuState };
