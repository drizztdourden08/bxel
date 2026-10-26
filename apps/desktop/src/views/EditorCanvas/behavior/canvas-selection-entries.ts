/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { CANVAS_SIZE_COMMAND_ID } from '../../../keymap/canvas-size-command-id.constants';
import { SELECTION_COMMAND_ID as ID } from '../../../keymap/selection-command-id.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { CANVAS_MENU } from '../EditorCanvas.constants';
import { pickHereEntries } from './pick-here-entries';

const transformEntries = (): ContextMenuEntry => ({
  label: CANVAS_MENU.transform,
  items: [ID.flipHorizontal, ID.flipVertical, ID.turnClockwise, ID.turnCounterClockwise, ID.rotate, ID.scale],
});

const thinSelection = (): boolean => {
  const { mask } = useSelectionStore.getState();
  const bounds = mask ? maskBounds(mask) : null;
  return bounds !== null && (bounds.width <= 2 || bounds.height <= 2);
};

const canvasSelectionEntries = (here: Point | null, pending: boolean, tile: boolean): readonly ContextMenuEntry[] => {
  const back: readonly ContextMenuEntry[] = tile ? [{ command: 'tilemap.place_tiles', label: CANVAS_MENU.backToPlace }] : [];
  if (pending) return [...back, ID.apply, ID.cancel, 'separator', transformEntries(), pickHereEntries(here)];
  return [
    ...back,
    ID.cut,
    ID.copy,
    { command: ID.paste, ...unless(useSelectionStore.getState().clipboard !== null, CANVAS_MENU.emptyClipboard) },
    ...(tile ? ['tilemap.duplicate_tile'] : []),
    'separator',
    transformEntries(),
    { label: CANVAS_MENU.selection, items: [ID.invert, ID.expand, { command: ID.shrink, ...unless(!thinSelection(), CANVAS_MENU.thin) }] },
    CANVAS_SIZE_COMMAND_ID.cropToSelection,
    pickHereEntries(here),
    'separator',
    ID.clear,
    { command: ID.delete, tone: 'danger' },
  ];
};

export { canvasSelectionEntries };
