/* @layer renderer-app @kind constants */
const SELECTION_TEXT = {
  group: 'Saved selections',
  save: 'Save selection as',
  title: 'Save selection',
  field: 'Name of the selection',
  hint: 'A selection with the same name is replaced.',
  count: (count: number): string => (count === 1 ? '1 sprite is saved.' : `${count} sprites are saved.`),
  drop: 'Delete saved selection',
  gone: 'The sprites of this selection are no longer in the file.',
  none: 'No saved selection yet',
} as const;

export { SELECTION_TEXT };
