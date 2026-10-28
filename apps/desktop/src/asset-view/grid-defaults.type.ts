/* @layer renderer-app @kind types */
import type { Sheet, Tileset } from '@bxel/document';
import type { Surface } from '../surface/surface.type';

interface GridInput {
  surface: Surface;
  tileset: Tileset | null;
  sheet: Sheet | null;
  setting: number;
}

export type { GridInput };
