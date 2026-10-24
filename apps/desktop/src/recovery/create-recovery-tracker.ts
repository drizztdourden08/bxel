/* @layer renderer-app @kind logic */
import { discardSnapshot } from './discard-snapshot';
import { flushSnapshots } from './flush-snapshots';
import { handleDocumentEvent } from './handle-document-event';
import type { RecoveryDeps, RecoveryRun, RecoveryTracker } from './recovery.type';

const createRecoveryTracker = (deps: RecoveryDeps): RecoveryTracker => {
  const run: RecoveryRun = {
    deps,
    state: { timers: new Map(), lastWrite: new Map(), written: new Set(), queue: new Map(), stops: [] },
  };
  const stop = (): void => {
    for (const end of run.state.stops) end();
    run.state.stops = [];
    for (const handle of run.state.timers.values()) deps.timers.clear(handle);
    run.state.timers.clear();
  };
  const start = (): void => {
    if (run.state.stops.length > 0) return;
    run.state.stops = [
      deps.host.subscribe((event) => handleDocumentEvent(run, event.documentId)),
      deps.host.subscribeChanges((change) => {
        if (change.kind === 'close') void discardSnapshot(run, change.documentId);
      }),
    ];
  };
  return {
    start,
    stop,
    flush: (documentId) => flushSnapshots(run, documentId),
    discard: (documentId) => discardSnapshot(run, documentId),
  };
};

export { createRecoveryTracker };
