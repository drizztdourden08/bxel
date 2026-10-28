/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView, Point } from '@bxel/raster';
import type { EditorTarget } from '../editor/editor.type';
import type { PaletteSlot } from '../editor/palette-slots.type';
import { samplePixel } from '../editor/sample-pixel';
import type { AnimationFocus } from '../timeline/timeline.type';
import { EXTRA_TEXT } from './status-extras.constants';
import type { StatusExtras } from './status-extras.type';

interface PixelRead {
  surface: 'sprite' | 'tile' | 'sheet' | 'map' | 'none';
  pointer: Point | null;
  target: EditorTarget | null;
  slots: readonly PaletteSlot[];
  mask: MaskView | null;
  move: Point | null;
  focus: AnimationFocus | null;
  cell: { at: Point; key: number | null } | null;
}

const indexOf = (read: PixelRead): StatusExtras['index'] => {
  if (!read.target || !read.pointer) return null;
  const index = samplePixel(read.target, read.pointer);
  const slot = index === null ? undefined : read.slots[index];
  if (!slot) return null;
  return { text: EXTRA_TEXT.indexValue(slot.index, slot.name), swatch: slot.transparent ? undefined : slot.hex };
};

const selectionOf = (mask: MaskView | null): string | null => {
  const box = mask ? maskBounds(mask) : null;
  return box ? EXTRA_TEXT.selectionValue(box.width, box.height, box.x, box.y) : null;
};

const frameOf = (focus: AnimationFocus | null): string | null => {
  if (!focus) return null;
  const at = focus.animation.frames.findIndex((each) => each.id === focus.frame.id) + 1;
  return EXTRA_TEXT.frameValue(at, focus.animation.frames.length, focus.frame.durationMs);
};

const readExtras = (read: PixelRead): StatusExtras => {
  const pixels = read.surface === 'sprite' || read.surface === 'tile';
  return {
    index: pixels ? indexOf(read) : null,
    selection: pixels ? selectionOf(read.mask) : null,
    drag: pixels && read.move ? EXTRA_TEXT.dragValue(read.move.x, read.move.y) : null,
    frame: read.surface === 'sprite' ? frameOf(read.focus) : null,
    cell: read.surface === 'map' && read.cell ? EXTRA_TEXT.cellValue(read.cell.at.x, read.cell.at.y) : null,
    tile: read.surface === 'map' && read.cell ? (read.cell.key === null ? EXTRA_TEXT.noTile : String(read.cell.key)) : null,
  };
};

export type { PixelRead };
export { readExtras };
