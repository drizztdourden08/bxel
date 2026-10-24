/* @layer renderer-app @kind constants */
import { startFlip } from '../../../editor/transform/start-flip';
import { startRotate } from '../../../editor/transform/start-rotate';
import { startScale } from '../../../editor/transform/start-scale';
import { startTurn } from '../../../editor/transform/start-turn';
import { SELECTION_COMMAND_ID as ID } from '../../../keymap/selection-command-id.constants';
import type { HintSpec } from '../../ActionHint';
import type { TransformAction } from '../CanvasToolbar.type';

const TRANSFORM_HINT: HintSpec = {
  name: 'Transform',
  description: 'Flip, turn or scale the selection, or the whole sprite when nothing is selected. Each action opens the Apply bar first.',
};

const TRANSFORM_CAPTION = 'Transform';

const FLIP_H_HINT: HintSpec = { name: 'Flip horizontal', description: 'Mirror the pixels from left to right.', shortcuts: [{ command: ID.flipHorizontal }] };

const FLIP_V_HINT: HintSpec = { name: 'Flip vertical', description: 'Mirror the pixels from top to bottom.', shortcuts: [{ command: ID.flipVertical }] };

const TURN_CW_HINT: HintSpec = {
  name: 'Rotate 90 clockwise',
  description: 'Turn the pixels a quarter turn to the right.',
  shortcuts: [{ command: ID.turnClockwise }],
};

const TURN_CCW_HINT: HintSpec = {
  name: 'Rotate 90 counterclockwise',
  description: 'Turn the pixels a quarter turn to the left.',
  shortcuts: [{ command: ID.turnCounterClockwise }],
};

const ROTATE_HINT: HintSpec = {
  name: 'Rotate...',
  description: 'Turn the pixels by any angle. A preview opens first.',
  shortcuts: [{ command: ID.rotate }],
};

const SCALE_HINT: HintSpec = {
  name: 'Scale...',
  description: 'Make the pixels larger or smaller. A preview opens first.',
  shortcuts: [{ command: ID.scale }],
};

const TRANSFORM_ACTIONS: readonly TransformAction[] = [
  { id: 'flip-h', run: () => startFlip('horizontal'), hint: FLIP_H_HINT },
  { id: 'flip-v', run: () => startFlip('vertical'), hint: FLIP_V_HINT },
  { id: 'turn-cw', run: () => startTurn('clockwise'), hint: TURN_CW_HINT },
  { id: 'turn-ccw', run: () => startTurn('counter-clockwise'), hint: TURN_CCW_HINT },
  { id: 'rotate', run: startRotate, hint: ROTATE_HINT },
  { id: 'scale', run: startScale, hint: SCALE_HINT },
];

export {
  FLIP_H_HINT, FLIP_V_HINT, ROTATE_HINT, SCALE_HINT, TRANSFORM_ACTIONS, TRANSFORM_CAPTION, TRANSFORM_HINT, TURN_CCW_HINT, TURN_CW_HINT,
};
