/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import { trackPixels } from '../canvas-dirty/track-pixels';
import { bankTable } from './bank-table';
import { CHANNELS } from './bank-table.constants';
import type { EditorTarget, Overlay } from './editor.type';
import { refreshRect } from './refresh-rect';
import { editMask } from './edit-mask';
import { overlayViewOf } from './overlay-view-of';

const createOverlay = (target: EditorTarget): Overlay => {
  const { sprite, bank, frameId } = target;
  const base = flattenFrame(sprite, frameId);
  const view = overlayViewOf(target);
  const overlay: Overlay = {
    width: sprite.width,
    height: sprite.height,
    base,
    indices: base.slice(),
    rgba: new Uint8ClampedArray(sprite.width * sprite.height * CHANNELS),
    table: bankTable(bank),
    dirty: null,
    revision: target.revision,
    mask: editMask(target),
    ...(view ? { view } : {}),
  };
  trackPixels(overlay.rgba);
  refreshRect(overlay, { x: 0, y: 0, width: sprite.width, height: sprite.height });
  return overlay;
};

export { createOverlay };
