/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { antiAliasLayer } from '../editor/anti-alias-layer';
import { gesture } from '../editor/gesture-state';
import { brushFromSelection } from '../editor/brush-from-selection';
import { outlineLayer } from '../editor/outline-layer';
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
    id: DRAWING_COMMAND.moveShape,
    label: 'Move the shape while drawing',
    group: COMMAND_GROUP.brush,
    chord: 'Space',
    when: () => gesture.dragging,
    run: () => {
      gesture.space = true;
    },
    hold: {
      release: () => {
        gesture.space = false;
      },
    },
  },
  {
    id: DRAWING_COMMAND.outline,
    label: 'Outline outside',
    group: COMMAND_GROUP.edit,
    chord: 'Shift+O',
    run: () => void outlineLayer('outside'),
  },
  {
    id: DRAWING_COMMAND.outlineInside,
    label: 'Outline inside',
    group: COMMAND_GROUP.edit,
    chord: 'Alt+Shift+O',
    run: () => void outlineLayer('inside'),
  },
  {
    id: DRAWING_COMMAND.outlineRing,
    label: 'Outline with 4 neighbours',
    group: COMMAND_GROUP.edit,
    checked: () => useDrawingStore.getState().outlineRing === 4,
    run: () => useDrawingStore.getState().patch({ outlineRing: useDrawingStore.getState().outlineRing === 4 ? 8 : 4 }),
  },
  {
    id: DRAWING_COMMAND.outlineSelOut,
    label: 'Outline with the darker ramp step',
    group: COMMAND_GROUP.edit,
    checked: () => useDrawingStore.getState().outlineSelOut,
    run: () => useDrawingStore.getState().patch({ outlineSelOut: !useDrawingStore.getState().outlineSelOut }),
  },
  {
    id: DRAWING_COMMAND.outlineFrames,
    label: 'Outline this frame, its tag or all frames',
    group: COMMAND_GROUP.edit,
    checked: () => useDrawingStore.getState().outlineFrames !== 'frame',
    run: () => {
      const now = useDrawingStore.getState().outlineFrames;
      useDrawingStore.getState().patch({ outlineFrames: now === 'frame' ? 'tag' : now === 'tag' ? 'all' : 'frame' });
    },
  },
  {
    id: DRAWING_COMMAND.antiAlias,
    label: 'Anti alias the front colour',
    group: COMMAND_GROUP.edit,
    run: () => void antiAliasLayer(),
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
