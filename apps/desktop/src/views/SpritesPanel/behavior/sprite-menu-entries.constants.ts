/* @layer renderer-app @kind constants */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { DIALOG_COMMAND } from '../../../keymap/dialog-command-id.constants';
import { SHEET_COMMAND } from '../../../keymap/sheet-command-id.constants';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';

const EMPTY_ENTRIES: readonly ContextMenuEntry[] = [
  { command: 'sprite.add_from_project', label: MANAGER_TEXT.addFromProject },
  { command: 'sprite.paste_entries', label: MANAGER_TEXT.paste },
  DIALOG_COMMAND.newSprite,
  { command: SHEET_COMMAND.importSheet, label: MANAGER_TEXT.importImage },
  'sprite.select_visible',
  'sprite.select_invert',
  'sprite.sort_by_name',
  'manager.clear_filters',
];

export { EMPTY_ENTRIES };
