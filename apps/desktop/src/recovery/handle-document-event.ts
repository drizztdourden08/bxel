/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { discardSnapshot } from './discard-snapshot';
import type { RecoveryRun } from './recovery.type';
import { scheduleSnapshot } from './schedule-snapshot';

const handleDocumentEvent = (run: RecoveryRun, documentId: DocumentId): void => {
  const view = run.deps.host.view(documentId);
  if (view === null) return;
  if (view.clean) {
    void discardSnapshot(run, documentId);
    run.deps.onClean(documentId);
  } else {
    scheduleSnapshot(run, documentId);
  }
};

export { handleDocumentEvent };
