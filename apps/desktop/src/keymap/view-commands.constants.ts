/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { zoomView } from '../editor/zoom-view';
import { useViewStore } from '../stores/useViewStore';
import { TILE_LABELS, TILE_MODES } from '../stores/view-store.constants';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP, COMMAND_ID, TILED_COMMAND } from './keymap.constants';

const TILED_COMMANDS: readonly CommandDef[] = TILE_MODES.map((mode) => ({
  id: TILED_COMMAND[mode],
  label: `Tiled preview: ${TILE_LABELS[mode]}`,
  group: COMMAND_GROUP.view,
  run: () => useViewStore.getState().setTiled(mode),
}));

const ZOOM_AND_GRID: readonly CommandDef[] = [
  { id: COMMAND_ID.zoomIn, label: 'Zoom in', group: COMMAND_GROUP.view, chord: ['Plus', '='], run: () => zoomView('in') },
  { id: COMMAND_ID.zoomOut, label: 'Zoom out', group: COMMAND_GROUP.view, chord: 'Minus', run: () => zoomView('out') },
  { id: COMMAND_ID.zoomFit, label: 'Zoom to fit', group: COMMAND_GROUP.view, chord: 'Mod+0', run: () => zoomView('fit') },
  { id: COMMAND_ID.zoomActual, label: 'Actual size', group: COMMAND_GROUP.view, chord: 'Mod+1', run: () => zoomView('actual') },
  {
    id: COMMAND_ID.pixelGrid,
    label: 'Pixel grid',
    group: COMMAND_GROUP.view,
    chord: "Mod+'",
    run: () => useViewStore.getState().toggleGrid(),
  },
];

const VIEW_COMMANDS: readonly CommandDef[] = [...ZOOM_AND_GRID, ...TILED_COMMANDS].map(editorCommand);

export { VIEW_COMMANDS };
