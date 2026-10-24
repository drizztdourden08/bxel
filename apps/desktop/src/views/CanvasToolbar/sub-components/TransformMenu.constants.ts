/* @layer renderer-app @kind constants */
import { cropToSelection } from '../../../canvas-size/crop-to-selection';
import { trimActiveSprite } from '../../../canvas-size/trim-active-sprite';
import { startFlip } from '../../../editor/transform/start-flip';
import { startRotate } from '../../../editor/transform/start-rotate';
import { startScale } from '../../../editor/transform/start-scale';
import { startTurn } from '../../../editor/transform/start-turn';
import { CANVAS_SIZE_COMMAND_ID } from '../../../keymap/canvas-size-command-id.constants';
import { useCanvasSizeStore } from '../../../stores/useCanvasSizeStore';
import { SELECTION_COMMAND_ID as ID } from '../../../keymap/selection-command-id.constants';
import type { HintSpec } from '../../ActionHint';
import type { TransformAction } from '../CanvasToolbar.type';

const TRANSFORM_HINT: HintSpec = {
  name: 'Transform',
  description: 'Flip, turn or scale the selection, or the whole sprite when nothing is selected, then crop, trim or resize the canvas.',
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

const CROP_HINT: HintSpec = {
  name: 'Crop to selection',
  description: 'Cut the canvas down to the box around the selection. Every frame and layer is cut the same way, in one undo step.',
  shortcuts: [{ command: CANVAS_SIZE_COMMAND_ID.cropToSelection }],
};

const TRIM_HINT: HintSpec = {
  name: 'Trim',
  description: 'Cut away the empty border around the drawing, over every frame. One undo step.',
  shortcuts: [{ command: CANVAS_SIZE_COMMAND_ID.trim }],
};

const CANVAS_SIZE_HINT: HintSpec = {
  name: 'Canvas size...',
  description: 'Make the canvas larger or smaller around an anchor. A dialog opens first, and Apply is one undo step.',
  shortcuts: [{ command: CANVAS_SIZE_COMMAND_ID.size }],
};

const TRANSFORM_ACTIONS: readonly TransformAction[] = [
  { id: 'flip-h', run: () => startFlip('horizontal'), hint: FLIP_H_HINT, icon: 'pixel-flip-h' },
  { id: 'flip-v', run: () => startFlip('vertical'), hint: FLIP_V_HINT, icon: 'pixel-flip-v' },
  { id: 'turn-cw', run: () => startTurn('clockwise'), hint: TURN_CW_HINT, icon: 'pixel-turn-right' },
  { id: 'turn-ccw', run: () => startTurn('counter-clockwise'), hint: TURN_CCW_HINT, icon: 'pixel-turn-left' },
  { id: 'rotate', run: startRotate, hint: ROTATE_HINT },
  { id: 'scale', run: startScale, hint: SCALE_HINT },
];

const CANVAS_ACTIONS: readonly TransformAction[] = [
  { id: 'crop', run: () => void cropToSelection(), hint: CROP_HINT, icon: 'pixel-select-rect', needsSelection: true },
  { id: 'trim', run: () => void trimActiveSprite(), hint: TRIM_HINT, icon: 'minimize-2' },
  { id: 'canvas-size', run: () => useCanvasSizeStore.getState().show(), hint: CANVAS_SIZE_HINT, icon: 'maximize-2' },
];

export {
  CANVAS_ACTIONS, CANVAS_SIZE_HINT, CROP_HINT, FLIP_H_HINT, FLIP_V_HINT, ROTATE_HINT, SCALE_HINT, TRANSFORM_ACTIONS, TRANSFORM_CAPTION, TRANSFORM_HINT,
  TRIM_HINT, TURN_CCW_HINT, TURN_CW_HINT,
};
