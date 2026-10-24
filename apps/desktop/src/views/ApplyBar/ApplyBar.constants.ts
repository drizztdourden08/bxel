/* @layer renderer-app @kind constants */
import { SELECTION_COMMAND_ID } from '../../keymap/selection-command-id.constants';
import type { HintSpec } from '../ActionHint';

const APPLY_BAR_TEXT = {
  region: 'Apply bar',
  scope: 'Edit scope',
  targets: (value: string): string => `Targets: ${value}`,
  layers: (value: string): string => `Layers: ${value}`,
  frames: (value: string): string => `Frames: ${value}`,
  clipping: (value: string): string => `Clipping: ${value}`,
  cancel: 'Cancel',
  apply: 'Apply',
} as const;

const APPLY_HINT: HintSpec = {
  name: APPLY_BAR_TEXT.apply,
  description: 'Keep the previewed edit and write it to the sprite.',
  shortcuts: [{ command: SELECTION_COMMAND_ID.apply }],
};

const CANCEL_HINT: HintSpec = {
  name: APPLY_BAR_TEXT.cancel,
  description: 'Throw the preview away and leave the sprite as it was.',
  shortcuts: [{ command: SELECTION_COMMAND_ID.cancel }, { keys: ['esc'] }],
};

export { APPLY_BAR_TEXT, APPLY_HINT, CANCEL_HINT };
