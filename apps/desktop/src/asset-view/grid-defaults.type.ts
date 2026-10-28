/* @layer renderer-app @kind types */
import type { Sheet, Tileset } from '@bxel/document';
import type { CanvasSurface } from '../canvas-surface/canvas-surface.type';

interface GridInput {
  surface: CanvasSurface;
  tileset: Tileset | null;
  sheet: Sheet | null;
  setting: number;
}

export type { GridInput };
