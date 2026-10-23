/* @layer renderer-app @kind constants */
const HISTORY_ITEMS = {
  undo: { ready: 'Undo', empty: 'Nothing to undo', icon: 'undo-2', shortcut: 'Ctrl+Z' },
  redo: { ready: 'Redo', empty: 'Nothing to redo', icon: 'redo-2', shortcut: 'Ctrl+Y' },
} as const;

export { HISTORY_ITEMS };
