/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { RecoveryState } from './recovery.type';

const snapshotQueue = (state: RecoveryState, documentId: DocumentId, work: () => Promise<void>): Promise<void> => {
  const previous = state.queue.get(documentId) ?? Promise.resolve();
  const next = previous.then(work).catch((): void => undefined);
  state.queue.set(documentId, next);
  return next;
};

export { snapshotQueue };
