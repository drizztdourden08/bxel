/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { RecoveryRun } from './recovery.type';

const cancelSnapshot = ({ deps, state }: RecoveryRun, documentId: DocumentId): void => {
  const handle = state.timers.get(documentId);
  if (handle === undefined) return;
  deps.timers.clear(handle);
  state.timers.delete(documentId);
};

export { cancelSnapshot };
