/* @layer renderer-app @kind constants */
const RECOVERY_DIALOG_TEXT = {
  title: 'Recover unsaved work',
  restore: 'Restore',
  discard: 'Discard',
  later: 'Decide later',
  unnamed: 'A file',
  found: (file: string, kept: string): string => `Bxel found unsaved work from your last session. ${file} was kept ${kept}.`,
  waiting: (count: number): string => `${count} more can be recovered after this one.`,
} as const;

export { RECOVERY_DIALOG_TEXT };
