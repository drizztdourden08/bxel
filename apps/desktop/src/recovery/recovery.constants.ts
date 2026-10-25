/* @layer renderer-app @kind constants */
import type { SnapshotTimers, SnapshotTiming } from './recovery.type';

const SNAPSHOT_TIMING: SnapshotTiming = { pauseMs: 2000, minGapMs: 5000 };

const REAL_TIMERS: SnapshotTimers = {
  set: (run, ms) => window.setTimeout(run, ms),
  clear: (handle) => window.clearTimeout(handle),
};

const RECOVERY_TEXT = {
  missing: 'The recovered copy could not be read.',
  restoreFailed: (reason: string): string => `Could not restore the recovered copy. ${reason}`,
  projectClosed: 'Its project could not be opened. Open the project, then restore the copy.',
  projectBusy: 'The project has unsaved changes. Save or close them, then restore the copy.',
  closeTitle: 'Unsaved changes',
  closeSave: 'Save',
  closeDiscard: 'Discard',
  closeCancel: 'Cancel',
  closePrompt: (file: string): string => `Save changes to ${file} before closing?`,
} as const;

export { RECOVERY_TEXT, REAL_TIMERS, SNAPSHOT_TIMING };
