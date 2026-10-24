/* @layer renderer-app @kind constants */
const COPY_TEXT = {
  menu: 'Duplicate with names',
  title: (count: number): string => (count === 1 ? 'Duplicate sprite' : `Duplicate ${count} sprites`),
  suffix: ' copy',
} as const;

export { COPY_TEXT };
