/* @layer renderer-app @kind constants */
const FILE_ACTION_TEXT = {
  cut: 'Cut',
  copy: 'Copy',
  paste: 'Paste',
  moveTo: 'Move to...',
  propertiesMany: (count: number): string => `Properties of ${count} files`,
} as const;

export { FILE_ACTION_TEXT };
