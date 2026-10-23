/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { cancelSnapshot } from './cancel-snapshot';
import type { RecoveryRun } from './recovery.type';
import { snapshotQueue } from './snapshot-queue';

const discardSnapshot = (run: RecoveryRun, documentId: DocumentId): Promise<void> => {
  const { deps, state } = run;
  cancelSnapshot(run, documentId);
  state.lastWrite.delete(documentId);
  if (!state.written.delete(documentId)) return Promise.resolve();
  return snapshotQueue(state, documentId, () => deps.sink.discard(documentId));
};

export { discardSnapshot };
