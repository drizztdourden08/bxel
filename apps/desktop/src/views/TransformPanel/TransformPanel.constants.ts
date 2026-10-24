/* @layer renderer-app @kind constants */
import { startFlip } from '../../editor/transform/start-flip';
import { startRotate } from '../../editor/transform/start-rotate';
import { startScale } from '../../editor/transform/start-scale';
import { startTurn } from '../../editor/transform/start-turn';
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
  { id: 'flip-h', label: 'Flip horizontal', shortcut: 'Shift+H', run: () => startFlip('horizontal') },
  { id: 'flip-v', label: 'Flip vertical', shortcut: 'Shift+V', run: () => startFlip('vertical') },
  { id: 'turn-cw', label: 'Rotate 90 clockwise', shortcut: 'Shift+R', run: () => startTurn('clockwise') },
  { id: 'turn-ccw', label: 'Rotate 90 counterclockwise', shortcut: 'Shift+Alt+R', run: () => startTurn('counter-clockwise') },
  { id: 'rotate', label: 'Rotate...', shortcut: null, run: startRotate },
  { id: 'scale', label: 'Scale...', shortcut: null, run: startScale },
];

export { TRANSFORM_ACTIONS, TRANSFORM_PANEL_TEXT };
