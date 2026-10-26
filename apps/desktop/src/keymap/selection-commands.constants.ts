/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { cancelPreview } from '../editor/pending/cancel-preview';
import { hasPreview } from '../editor/pending/has-preview';
import { clearSelection } from '../editor/selection/clear-selection';
import { copySelection } from '../editor/selection/copy-selection';
import { cutSelection } from '../editor/selection/cut-selection';
import { deleteSelection } from '../editor/selection/delete-selection';
import { invertSelection } from '../editor/selection/invert-selection';
import { pasteClip } from '../editor/selection/paste-clip';
import { resizeSelection } from '../editor/selection/resize-selection';
import { selectAll } from '../editor/selection/select-all';
import { startFlip } from '../editor/transform/start-flip';
import { startRotate } from '../editor/transform/start-rotate';
import { startScale } from '../editor/transform/start-scale';
import { startTurn } from '../editor/transform/start-turn';
import { hasActiveDocument } from '../files/has-active-document';
import { enterAction } from '../sheet/enter-action';
import { enterReady } from '../sheet/enter-ready';
import { useTilemapStore } from '../stores/useTilemapStore';
import { clearCells } from '../tilemap/clear-cells';
import { selectAllCells } from '../tilemap/select-all-cells';
import { turnCells } from '../tilemap/turn-cells';
import { editorCommand } from './editor-command';
import { COMMAND_ZONE } from './command-zone.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { mapOr } from './map-or';
import { pixelCommand } from './pixel-command';
import { SELECTION_COMMAND_ID as ID } from './selection-command-id.constants';

const group = COMMAND_GROUP.edit;
const zone = COMMAND_ZONE.canvas;

const SELECTION_EDITS: readonly CommandDef[] = [
  { id: ID.selectAll, label: 'Select all', group, chord: 'Mod+A', zone, whileTyping: false, run: mapOr(selectAllCells, selectAll) },
  {
    id: ID.clear,
    label: 'Deselect',
    group,
    chord: 'Mod+D',
    whileTyping: false,
    run: mapOr(() => useTilemapStore.getState().setSelection(null), clearSelection),
  },
  pixelCommand({ id: ID.invert, label: 'Invert selection', group, chord: 'Mod+Shift+I', whileTyping: false, run: invertSelection }),
  pixelCommand({ id: ID.expand, label: 'Expand selection by 1 pixel', group, run: () => resizeSelection(1) }),
  pixelCommand({ id: ID.shrink, label: 'Shrink selection by 1 pixel', group, run: () => resizeSelection(-1) }),
  pixelCommand({ id: ID.copy, label: 'Copy', group, chord: 'Mod+C', whileTyping: false, run: copySelection }),
  pixelCommand({ id: ID.cut, label: 'Cut', group, chord: 'Mod+X', whileTyping: false, run: cutSelection }),
  pixelCommand({ id: ID.paste, label: 'Paste', group, chord: 'Mod+V', whileTyping: false, run: pasteClip }),
  {
    id: ID.delete,
    label: 'Delete',
    group,
    chord: 'Delete',
    zone,
    whileTyping: false,
    run: mapOr(clearCells, deleteSelection),
  },
];

const PREVIEW_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.apply,
    label: 'Apply',
    group,
    chord: 'Enter',
    whileTyping: false,
    when: () => hasActiveDocument() && enterReady(),
    run: enterAction,
  },
  {
    id: ID.cancel,
    label: 'Cancel',
    group,
    when: () => hasActiveDocument() && hasPreview(),
    run: cancelPreview,
  },
];

const TRANSFORM_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.flipHorizontal,
    label: 'Flip horizontal',
    group,
    chord: 'Shift+H',
    whileTyping: false,
    run: mapOr(() => turnCells('flipX'), () => startFlip('horizontal')),
  },
  {
    id: ID.flipVertical,
    label: 'Flip vertical',
    group,
    chord: 'Shift+V',
    whileTyping: false,
    run: mapOr(() => turnCells('flipY'), () => startFlip('vertical')),
  },
  {
    id: ID.turnClockwise,
    label: 'Rotate 90 clockwise',
    group,
    chord: 'Shift+R',
    whileTyping: false,
    run: mapOr(() => turnCells('turn'), () => startTurn('clockwise')),
  },
  pixelCommand({
    id: ID.turnCounterClockwise,
    label: 'Rotate 90 counterclockwise',
    group,
    chord: 'Shift+Alt+R',
    whileTyping: false,
    run: () => startTurn('counter-clockwise'),
  }),
  pixelCommand({ id: ID.rotate, label: 'Rotate...', group, run: startRotate }),
  pixelCommand({ id: ID.scale, label: 'Scale...', group, run: startScale }),
];

const SELECTION_COMMANDS: readonly CommandDef[] = [...SELECTION_EDITS, ...PREVIEW_COMMANDS, ...TRANSFORM_COMMANDS].map(editorCommand);

export { SELECTION_COMMANDS };
