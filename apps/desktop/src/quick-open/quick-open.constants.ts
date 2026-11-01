/* @layer renderer-app @kind constants */
const QUICK_OPEN_SKIPPED: ReadonlySet<string> = new Set(['other', 'data', 'project']);

const QUICK_OPEN_TEXT = {
  title: 'Open a project file',
  label: 'Quick open a project file',
  empty: 'This project has no files to open.',
  unavailable: 'Open a project first.',
} as const;

export { QUICK_OPEN_SKIPPED, QUICK_OPEN_TEXT };
