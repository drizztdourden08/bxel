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
  closePrompt: (files: string): string =>
    `Save changes to ${files} before closing? Choose Stay to go back and save. Quit keeps a recovery copy.`,
} as const;

export { RECOVERY_TEXT, REAL_TIMERS, SNAPSHOT_TIMING };
