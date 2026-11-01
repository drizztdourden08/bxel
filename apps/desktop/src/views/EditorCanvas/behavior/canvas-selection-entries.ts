/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { CANVAS_SIZE_COMMAND_ID } from '../../../keymap/canvas-size-command-id.constants';
import { SELECTION_COMMAND_ID as ID } from '../../../keymap/selection-command-id.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { CANVAS_MENU } from '../EditorCanvas.constants';
import { pickHereEntries } from './pick-here-entries';

const transformEntries = (): ContextMenuEntry => ({
  label: CANVAS_MENU.transform,
  items: [ID.flipHorizontal, ID.flipVertical, ID.turnClockwise, ID.turnCounterClockwise, ID.turnHalf, ID.transform, ID.rotate, ID.scale],
});

const fillEntries = (): ContextMenuEntry => ({ label: CANVAS_MENU.fillStroke, items: [ID.fillFront, ID.fillBack, ID.strokeInside, ID.strokeOutside] });

const alignEntries = (): ContextMenuEntry => ({
  label: CANVAS_MENU.align,
  items: [ID.alignLeft, ID.alignCentre, ID.alignRight, ID.alignTop, ID.alignMiddle, ID.alignBottom, ID.distributeHorizontal, ID.distributeVertical],
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
    ID.copyMerged,
    ID.copyNewSprite,
    { command: ID.paste, ...unless(useSelectionStore.getState().clipboard !== null || useSelectionStore.getState().systemClip, CANVAS_MENU.emptyClipboard) },
    ...(tile ? ['tilemap.duplicate_tile'] : []),
    'separator',
    transformEntries(),
    {
      label: CANVAS_MENU.selection,
      items: [ID.invert, ID.expand, { command: ID.shrink, ...unless(!thinSelection(), CANVAS_MENU.thin) }, ID.border, ID.smooth, ID.reselect, ID.selectOpaque, ID.save, ID.toGuides],
    },
    fillEntries(),
    alignEntries(),
    CANVAS_SIZE_COMMAND_ID.cropToSelection,
    COMMAND_ID.zoomSelection,
    pickHereEntries(here),
    'separator',
    ID.clear,
    { command: ID.delete, tone: 'danger' },
  ];
};

export { canvasSelectionEntries };
