/* @layer renderer-app @kind constants */
import { SHEET_COMMAND as ID } from '../keymap/sheet-command-id.constants';
import { MANAGER_TEXT } from '../sheet-manager/manager-text.constants';

const ARRANGE_KINDS = [
  { command: ID.arrangeGrid, label: MANAGER_TEXT.arrangeGrid, kind: 'grid' },
  { command: ID.arrangePacked, label: MANAGER_TEXT.arrangePacked, kind: 'packed' },
  { command: ID.arrangeManual, label: MANAGER_TEXT.arrangeManual, kind: 'manual' },
] as const;

export { ARRANGE_KINDS };
