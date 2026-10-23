/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useFileStore } from '../stores/useFileStore';
import { createRecoveryTracker } from './create-recovery-tracker';
import { describeDocument } from './describe-document';
import { platformSink } from './platform-sink';
import { REAL_TIMERS, SNAPSHOT_TIMING } from './recovery.constants';
import type { RecoveryTracker } from './recovery.type';

const recoveryService: RecoveryTracker = createRecoveryTracker({
  host: useDocumentStore.getState().host,
  sink: platformSink,
  timers: REAL_TIMERS,
  timing: SNAPSHOT_TIMING,
  clock: () => Date.now(),
  now: () => Date.now(),
  describe: describeDocument,
  onClean: (documentId) => useFileStore.getState().clearRecovered(documentId),
});

export { recoveryService };
