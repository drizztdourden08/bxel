/* @layer renderer-app @kind types */
import type { MaskView, Point } from '@bxel/raster';
import type { EditorTarget } from '../editor/editor.type';
import type { PaletteSlot } from '../editor/palette-slots.type';
import type { CanvasSurface } from '../canvas-surface/canvas-surface.type';
import type { AnimationFocus } from '../timeline/timeline.type';

interface PixelRead {
  surface: CanvasSurface;
  pointer: Point | null;
  target: EditorTarget | null;
  slots: readonly PaletteSlot[];
  mask: MaskView | null;
  move: Point | null;
  focus: AnimationFocus | null;
  cell: { at: Point; key: number | null } | null;
}

export type { PixelRead };
