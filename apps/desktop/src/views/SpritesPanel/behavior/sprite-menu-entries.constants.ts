/* @layer renderer-app @kind constants */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { DIALOG_COMMAND } from '../../../keymap/dialog-command-id.constants';

const EMPTY_ENTRIES: readonly ContextMenuEntry[] = [
  DIALOG_COMMAND.newSprite,
  'sprite.select_visible',
  'sprite.select_invert',
  'sprite.select_unplaced',
  'sprite.sort_by_name',
  'manager.clear_filters',
];

export { EMPTY_ENTRIES };
