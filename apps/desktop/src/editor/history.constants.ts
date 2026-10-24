/* @layer renderer-app @kind constants */
import { COMMAND_ID } from '../keymap/keymap.constants';

const HISTORY_ITEMS = {
  undo: { ready: 'Undo', empty: 'Nothing to undo', icon: 'undo-2', command: COMMAND_ID.undo },
  redo: { ready: 'Redo', empty: 'Nothing to redo', icon: 'redo-2', command: COMMAND_ID.redo },
} as const;

export { HISTORY_ITEMS };
