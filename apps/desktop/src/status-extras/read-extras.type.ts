/* @layer renderer-app @kind types */
import type { MaskView, Point } from '@bxel/raster';
import type { EditorTarget } from '../editor/editor.type';
import type { PaletteSlot } from '../editor/palette-slots.type';
import type { Surface } from '../surface/surface.type';
import type { AnimationFocus } from '../timeline/timeline.type';

interface PixelRead {
  surface: Surface;
  pointer: Point | null;
  target: EditorTarget | null;
  slots: readonly PaletteSlot[];
  mask: MaskView | null;
  move: Point | null;
  focus: AnimationFocus | null;
  cell: { at: Point; key: number | null } | null;
}

export type { PixelRead };
