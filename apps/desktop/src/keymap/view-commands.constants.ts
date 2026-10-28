/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { zoomView } from '../editor/zoom-view';
import { zoomAtPointer } from '../view-zoom/zoom-at-pointer';
import { zoomSelection } from '../view-zoom/zoom-selection';
import { DIGIT_ZOOM } from '../view-zoom/view-zoom.constants';
import { useViewStore } from '../stores/useViewStore';
import { TILE_LABELS, TILE_MODES, VIEW_TOGGLE_ROWS } from '../stores/view-store.constants';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP, COMMAND_ID, TILED_COMMAND } from './keymap.constants';

const TILED_COMMANDS: readonly CommandDef[] = TILE_MODES.map((mode) => ({
  id: TILED_COMMAND[mode],
  label: `Tiled preview: ${TILE_LABELS[mode]}`,
  group: COMMAND_GROUP.view,
  checked: () => useViewStore.getState().tiled === mode,
  run: () => useViewStore.getState().setTiled(mode),
}));

const TOGGLE_COMMANDS: readonly CommandDef[] = VIEW_TOGGLE_ROWS.map((row) => ({
  id: row.command,
  label: row.label,
  group: COMMAND_GROUP.view,
  chord: row.chord,
  checked: () => useViewStore.getState()[row.toggle],
  run: () => useViewStore.getState().toggleView(row.toggle),
}));

const ZOOM_COMMANDS: readonly CommandDef[] = [
  { id: COMMAND_ID.zoomIn, label: 'Zoom in', group: COMMAND_GROUP.view, chord: ['Plus', '='], run: () => zoomView('in') },
  { id: COMMAND_ID.zoomOut, label: 'Zoom out', group: COMMAND_GROUP.view, chord: 'Minus', run: () => zoomView('out') },
  { id: COMMAND_ID.zoomFit, label: 'Zoom to fit', group: COMMAND_GROUP.view, chord: 'Mod+0', run: () => zoomView('fit') },
  { id: COMMAND_ID.zoomActual, label: 'Actual size', group: COMMAND_GROUP.view, chord: 'Mod+1', run: () => zoomView('actual') },
  { id: COMMAND_ID.zoomSelection, label: 'Zoom to selection', group: COMMAND_GROUP.view, chord: 'Mod+Shift+0', run: zoomSelection },
];

const DIGIT_COMMANDS: readonly CommandDef[] = Object.entries(DIGIT_ZOOM).map(([digit, percent]) => ({
  id: COMMAND_ID.zoomPercent(percent),
  label: `Zoom to ${percent}% at the pointer`,
  group: COMMAND_GROUP.view,
  chord: digit,
  run: () => zoomAtPointer(percent),
}));

const VIEW_COMMANDS: readonly CommandDef[] = [...ZOOM_COMMANDS, ...DIGIT_COMMANDS, ...TOGGLE_COMMANDS, ...TILED_COMMANDS].map(editorCommand);

export { VIEW_COMMANDS };
