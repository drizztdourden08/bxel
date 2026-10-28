/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { brushFromSelection } from '../editor/brush-from-selection';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';

const DRAWING_COMMANDS: readonly CommandDef[] = [
  {
    id: 'drawing.cycle_ink',
    label: 'Next ink',
    group: COMMAND_GROUP.brush,
    chord: 'Shift+S',
    run: () => useDrawingStore.getState().cycleInk(),
  },
  {
    id: 'drawing.toggle_pixel_perfect',
    label: 'Pixel perfect',
    group: COMMAND_GROUP.brush,
    chord: 'Shift+P',
    checked: () => useToolStore.getState().pixelPerfect,
    run: () => useToolStore.getState().setPixelPerfect(!useToolStore.getState().pixelPerfect),
  },
  {
    id: 'symmetry.toggle_diagonal',
    label: 'Symmetry diagonal',
    group: COMMAND_GROUP.brush,
    chord: 'Alt+D',
    checked: () => useDrawingStore.getState().symmetryDiagonal,
    run: () => useDrawingStore.getState().toggleSymmetryMode('diagonal'),
  },
  {
    id: 'symmetry.toggle_turn',
    label: 'Symmetry 4 way',
    group: COMMAND_GROUP.brush,
    chord: 'Alt+R',
    checked: () => useDrawingStore.getState().symmetryTurn,
    run: () => useDrawingStore.getState().toggleSymmetryMode('turn'),
  },
  {
    id: 'brush.from_selection',
    label: 'New brush from selection',
    group: COMMAND_GROUP.brush,
    chord: 'Mod+B',
    run: () => {
      brushFromSelection();
    },
  },
].map(editorCommand);

export { DRAWING_COMMANDS };
