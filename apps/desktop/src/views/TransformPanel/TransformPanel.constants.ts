/* @layer renderer-app @kind constants */
import { startFlip } from '../../editor/transform/start-flip';
import { startRotate } from '../../editor/transform/start-rotate';
import { startScale } from '../../editor/transform/start-scale';
import { startTurn } from '../../editor/transform/start-turn';
import { SELECTION_COMMAND_ID as ID } from '../../keymap/selection-command-id.constants';
import type { TransformAction } from './TransformPanel.type';

const TRANSFORM_PANEL_TEXT = {
  empty: 'No sprite is open.',
  title: 'Transform',
  actions: 'Transform actions',
  whole: 'Acts on the whole sprite, every layer and frame.',
  selection: (width: number, height: number, x: number, y: number): string =>
    `Acts on the selection: ${width} by ${height} pixels at ${x}, ${y}.`,
  note: 'Each action opens the Apply bar first. Enter applies and Escape cancels.',
} as const;

const TRANSFORM_ACTIONS: readonly TransformAction[] = [
  {
    id: 'flip-h',
    run: () => startFlip('horizontal'),
    hint: { name: 'Flip horizontal', description: 'Mirror the pixels from left to right.', shortcuts: [{ command: ID.flipHorizontal }] },
  },
  {
    id: 'flip-v',
    run: () => startFlip('vertical'),
    hint: { name: 'Flip vertical', description: 'Mirror the pixels from top to bottom.', shortcuts: [{ command: ID.flipVertical }] },
  },
  {
    id: 'turn-cw',
    run: () => startTurn('clockwise'),
    hint: { name: 'Rotate 90 clockwise', description: 'Turn the pixels a quarter turn to the right.', shortcuts: [{ command: ID.turnClockwise }] },
  },
  {
    id: 'turn-ccw',
    run: () => startTurn('counter-clockwise'),
    hint: {
      name: 'Rotate 90 counterclockwise',
      description: 'Turn the pixels a quarter turn to the left.',
      shortcuts: [{ command: ID.turnCounterClockwise }],
    },
  },
  {
    id: 'rotate',
    run: startRotate,
    hint: { name: 'Rotate...', description: 'Turn the pixels by any angle. A preview opens first.', shortcuts: [{ command: ID.rotate }] },
  },
  {
    id: 'scale',
    run: startScale,
    hint: { name: 'Scale...', description: 'Make the pixels larger or smaller. A preview opens first.', shortcuts: [{ command: ID.scale }] },
  },
];

export { TRANSFORM_ACTIONS, TRANSFORM_PANEL_TEXT };
