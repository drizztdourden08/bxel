/* @layer renderer-app @kind constants */
import { announce } from '@drizztdourden08/brock-react';
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { PixelArgs } from '../context-menu/menu-args.type';
import { describeCanvas } from '../canvas-describe/describe-canvas';
import { readRow } from '../canvas-describe/read-row';
import { zoomView } from '../editor/zoom-view';
import { useViewStore } from '../stores/useViewStore';
import type { ViewToggle, ViewToggleRow } from '../stores/view-store.type';
import { TILE_LABELS, TILE_MODES, VIEW_TOGGLE_ROWS } from '../stores/view-store.constants';
import { centreViewHere } from '../view-zoom/centre-view-here';
import { DIGIT_ZOOM } from '../view-zoom/view-zoom.constants';
import { zoomAtPointer } from '../view-zoom/zoom-at-pointer';
import { zoomSelection } from '../view-zoom/zoom-selection';
import { COMMAND_GROUP, COMMAND_ID, TILED_COMMAND } from './keymap.constants';
import { HOLD_TOGGLES } from './hold-toggle.constants';
import { holdToggle, pressToggle } from './hold-toggle';
import { ruled } from './ruled';

const TILED_COMMANDS: readonly CommandDef[] = TILE_MODES.map((mode) => ({
  id: TILED_COMMAND[mode],
  label: `Tiled preview: ${TILE_LABELS[mode]}`,
  group: COMMAND_GROUP.view,
  checked: () => useViewStore.getState().tiled === mode,
  run: () => useViewStore.getState().setTiled(mode),
}));

const SPOKEN: readonly ViewToggle[] = ['snap', 'mirror', 'split', 'splitLink', 'splitActual', 'hideOverlays', 'loupe', 'backgroundPreview', 'fullscreen', 'lockGuides'];

const toggleRun = (row: ViewToggleRow): CommandDef['run'] => () => {
  if (HOLD_TOGGLES.includes(row.toggle)) {
    pressToggle(row.toggle, row.label);
    return;
  }
  useViewStore.getState().toggleView(row.toggle);
  if (SPOKEN.includes(row.toggle)) announce(`${row.label} ${useViewStore.getState()[row.toggle] ? 'on' : 'off'}`);
};

const TOGGLE_COMMANDS: readonly CommandDef[] = VIEW_TOGGLE_ROWS.map((row) => ({
  id: row.command,
  label: row.label,
  group: COMMAND_GROUP.view,
  chord: row.chord,
  checked: () => useViewStore.getState()[row.toggle],
  ...(HOLD_TOGGLES.includes(row.toggle) ? { hold: holdToggle(row.toggle, row.label) } : {}),
  run: toggleRun(row),
}));

const ZOOM_COMMANDS: readonly CommandDef[] = [
  { id: COMMAND_ID.zoomIn, label: 'Zoom in', group: COMMAND_GROUP.view, chord: ['Plus', '='], run: () => zoomView('in') },
  { id: COMMAND_ID.zoomOut, label: 'Zoom out', group: COMMAND_GROUP.view, chord: 'Minus', run: () => zoomView('out') },
  { id: COMMAND_ID.zoomFit, label: 'Zoom to fit', group: COMMAND_GROUP.view, chord: 'Mod+0', run: () => zoomView('fit') },
  { id: COMMAND_ID.zoomActual, label: 'Actual size', group: COMMAND_GROUP.view, chord: 'Mod+1', run: () => zoomView('actual') },
  { id: COMMAND_ID.zoomSelection, label: 'Zoom to selection', group: COMMAND_GROUP.view, chord: 'Mod+Shift+0', run: zoomSelection },
];

const READ_COMMANDS: readonly CommandDef[] = [
  { id: COMMAND_ID.describeCanvas, label: 'Describe canvas', group: COMMAND_GROUP.view, chord: 'Mod+Alt+Shift+D', run: describeCanvas },
  { id: COMMAND_ID.centreHere, label: 'Centre view here', group: COMMAND_GROUP.view, run: (context?: CommandContext) => centreViewHere(commandArgs<PixelArgs>(context)) },
  { id: COMMAND_ID.readRow, label: 'Read row', group: COMMAND_GROUP.view, chord: 'Mod+Alt+R', run: readRow },
];

const DIGIT_COMMANDS: readonly CommandDef[] = Object.entries(DIGIT_ZOOM).map(([digit, percent]) => ({
  id: COMMAND_ID.zoomPercent(percent),
  label: `Zoom to ${percent}% at the pointer`,
  group: COMMAND_GROUP.view,
  chord: digit,
  run: () => zoomAtPointer(percent),
}));

const VIEW_COMMANDS: readonly CommandDef[] = [...ZOOM_COMMANDS, ...READ_COMMANDS, ...DIGIT_COMMANDS, ...TOGGLE_COMMANDS, ...TILED_COMMANDS].map(ruled);

export { VIEW_COMMANDS };
