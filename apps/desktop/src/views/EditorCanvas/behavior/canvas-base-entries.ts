/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { viewEntries } from '../../../context-menu/view-entries';
import { CANVAS_SIZE_COMMAND_ID } from '../../../keymap/canvas-size-command-id.constants';
import { FILE_COMMAND } from '../../../files/files.constants';
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { CANVAS_MENU } from '../EditorCanvas.constants';
import { historyEntries } from './history-entries';
import { pickHereEntries } from './pick-here-entries';
import { symmetryEntries } from './symmetry-entries';

const canvasBaseEntries = (here: Point | null, tile: boolean): readonly ContextMenuEntry[] => [
  ...(tile ? [{ command: 'tilemap.place_tiles', label: CANVAS_MENU.backToPlace }] : []),
  pickHereEntries(here),
  { command: SELECTION_COMMAND_ID.paste, ...unless(useSelectionStore.getState().clipboard !== null, CANVAS_MENU.emptyClipboard) },
  ...(tile ? ['tilemap.duplicate_tile'] : []),
  SELECTION_COMMAND_ID.selectAll,
  {
    label: CANVAS_MENU.selectHere,
    hidden: here === null,
    items: [
      { command: 'selection.by_colour', label: CANVAS_MENU.region, args: { x: here?.x, y: here?.y, mode: 'region' } },
      { command: 'selection.by_colour', label: CANVAS_MENU.everywhere, args: { x: here?.x, y: here?.y, mode: 'everywhere' } },
    ],
  },
  'separator',
  ...historyEntries(),
  'separator',
  viewEntries({ major: true, tile: true, tiled: true, guides: true }),
  symmetryEntries(here),
  {
    label: CANVAS_MENU.canvas,
    items: [{ command: CANVAS_SIZE_COMMAND_ID.size, hidden: tile }, CANVAS_SIZE_COMMAND_ID.trim],
  },
  { command: FILE_COMMAND.export, hidden: tile },
];

export { canvasBaseEntries };
