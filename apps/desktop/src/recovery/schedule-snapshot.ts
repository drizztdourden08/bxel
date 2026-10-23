/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { RecoveryRun } from './recovery.type';
import { snapshotQueue } from './snapshot-queue';
import { writeSnapshot } from './write-snapshot';

const scheduleSnapshot = (run: RecoveryRun, documentId: DocumentId): void => {
  const { deps, state } = run;
  if (state.timers.has(documentId)) return;
  const last = state.lastWrite.get(documentId) ?? Number.NEGATIVE_INFINITY;
  const wait = Math.max(deps.timing.pauseMs, last + deps.timing.minGapMs - deps.now());
  const handle = deps.timers.set(() => {
    state.timers.delete(documentId);
    void snapshotQueue(state, documentId, () => writeSnapshot(run, documentId));
  }, wait);
  state.timers.set(documentId, handle);
};

export { scheduleSnapshot };
