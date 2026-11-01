/* @layer renderer-app @kind types */
import type { Point, MaskView, ShapeKind, Size } from '@bxel/raster';
import type { EditorTarget } from '../../../editor/editor.type';

interface QuickMaskPress {
  target: EditorTarget;
  size: Size;
  base: MaskView | null;
  scratch: Uint8Array;
  anchor: Point;
  last: Point;
  erase: boolean;
  shape: ShapeKind | null;
}

interface QuickMaskMods {
  constrain: boolean;
  centre: boolean;
}

export type { QuickMaskMods, QuickMaskPress };
