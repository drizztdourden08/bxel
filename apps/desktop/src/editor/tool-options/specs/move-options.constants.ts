/* @layer renderer-app @kind constants */
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { OptionSpec } from '../tool-options.type';
import { choiceSpec } from './choice-spec';
import { MOVE_TARGET_CHOICES, MOVE_TEXT, NUDGE_UNIT_CHOICES } from './move-text.constants';
import { toggleSpec } from './toggle-spec';

const d = () => useDrawingStore.getState();

const MOVE_OPTIONS: readonly OptionSpec[] = [
  choiceSpec({
    tool: 'move', name: 'moves', label: MOVE_TEXT.moves, description: MOVE_TEXT.movesDescription, priority: 5, group: 'move', default: 'selection',
    choices: MOVE_TARGET_CHOICES, read: () => d().moveTarget, write: (value) => d().patch({ moveTarget: value === 'layer' ? 'layer' : 'selection' }),
  }),
  choiceSpec({
    tool: 'move', name: 'nudge_unit', label: MOVE_TEXT.nudgeUnit, description: MOVE_TEXT.nudgeUnitDescription, priority: 11, group: 'move', default: 'pixel',
    choices: NUDGE_UNIT_CHOICES, read: () => d().nudgeUnit, write: (value) => d().patch({ nudgeUnit: value === 'tile' ? 'tile' : 'pixel' }),
  }),
  toggleSpec({
    tool: 'move', name: 'auto_pick', label: MOVE_TEXT.autoPick, description: MOVE_TEXT.autoPickDescription, priority: 20, group: 'move', tier: 2,
    icon: 'pixel-move', read: () => d().moveAutoPick, write: (on) => d().patch({ moveAutoPick: on }),
  }),
];

export { MOVE_OPTIONS };
