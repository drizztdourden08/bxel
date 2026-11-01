/* @layer renderer-app @kind constants */
const MOVE_TO_TEXT = {
  title: 'Move to',
  message: (count: number): string => `Pick the folder to move ${count} ${count === 1 ? 'item' : 'items'} into.`,
  cancel: 'Cancel',
  empty: 'There is no other folder to move into.',
  list: 'Destination folders',
} as const;

export { MOVE_TO_TEXT };
