/* @layer renderer-app @kind types */
import type { Point, MaskView, Size } from '@bxel/raster';
import type { EditorTarget } from '../../../editor/editor.type';

interface QuickMaskPress {
  target: EditorTarget;
  size: Size;
  base: MaskView | null;
  scratch: Uint8Array;
  last: Point;
  erase: boolean;
}

export type { QuickMaskPress };
