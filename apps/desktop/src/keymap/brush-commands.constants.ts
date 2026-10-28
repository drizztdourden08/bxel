/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { stepColour } from '../editor/step-colour';
import { useToolStore } from '../stores/useToolStore';
import { COMMAND_GROUP, COMMAND_ID } from './keymap.constants';
import { ruled } from './ruled';

const BRUSH_COMMANDS: readonly CommandDef[] = [
  {
    id: COMMAND_ID.brushSmaller,
    label: 'Smaller brush',
    group: COMMAND_GROUP.brush,
    chord: '[',
    run: () => useToolStore.getState().stepBrushSize(-1),
  },
  {
    id: COMMAND_ID.brushLarger,
    label: 'Larger brush',
    group: COMMAND_GROUP.brush,
    chord: ']',
    run: () => useToolStore.getState().stepBrushSize(1),
  },
  {
    id: COMMAND_ID.symmetryX,
    label: 'Symmetry X',
    group: COMMAND_GROUP.brush,
    chord: 'Alt+X',
    checked: () => useToolStore.getState().symmetryX,
    run: () => useToolStore.getState().toggleSymmetry('x'),
  },
  {
    id: COMMAND_ID.symmetryY,
    label: 'Symmetry Y',
    group: COMMAND_GROUP.brush,
    chord: 'Alt+Y',
    checked: () => useToolStore.getState().symmetryY,
    run: () => useToolStore.getState().toggleSymmetry('y'),
  },
  {
    id: COMMAND_ID.swapColours,
    label: 'Swap colours',
    group: COMMAND_GROUP.colours,
    chord: 'X',
    run: () => useToolStore.getState().swapColors(),
  },
  {
    id: COMMAND_ID.swapColourPairs,
    label: 'Swap colour pairs',
    group: COMMAND_GROUP.colours,
    chord: 'Shift+X',
    run: () => useToolStore.getState().swapPairs(),
  },
  {
    id: COMMAND_ID.colourBack,
    label: 'Previous colour',
    group: COMMAND_GROUP.colours,
    chord: 'Q',
    run: () => stepColour(-1),
  },
  {
    id: COMMAND_ID.colourForward,
    label: 'Next colour',
    group: COMMAND_GROUP.colours,
    chord: 'W',
    run: () => stepColour(1),
  },
].map(ruled);

export { BRUSH_COMMANDS };
