/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { brushFromSelection } from '../editor/brush-from-selection';
import { useDrawingStore } from '../stores/useDrawingStore';
import { DRAWING_COMMAND } from './drawing-command-id.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const DRAWING_COMMANDS: readonly CommandDef[] = [
  {
    id: DRAWING_COMMAND.symmetryDiagonal,
    label: 'Symmetry diagonal',
    group: COMMAND_GROUP.brush,
    chord: 'Alt+D',
    checked: () => useDrawingStore.getState().symmetryDiagonal,
    run: () => useDrawingStore.getState().toggleSymmetryMode('diagonal'),
  },
  {
    id: DRAWING_COMMAND.symmetryTurn,
    label: 'Symmetry 4 way',
    group: COMMAND_GROUP.brush,
    chord: 'Alt+R',
    checked: () => useDrawingStore.getState().symmetryTurn,
    run: () => useDrawingStore.getState().toggleSymmetryMode('turn'),
  },
  {
    id: DRAWING_COMMAND.brushFromSelection,
    label: 'New brush from selection',
    group: COMMAND_GROUP.brush,
    chord: 'Mod+B',
    run: () => void brushFromSelection(),
  },
].map(ruled);

export { DRAWING_COMMANDS };
