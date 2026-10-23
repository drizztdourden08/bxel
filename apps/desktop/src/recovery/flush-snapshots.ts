/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { cancelSnapshot } from './cancel-snapshot';
import type { RecoveryRun } from './recovery.type';
import { snapshotQueue } from './snapshot-queue';
import { writeSnapshot } from './write-snapshot';

const flushSnapshots = async (run: RecoveryRun, documentId?: DocumentId): Promise<void> => {
  const ids = documentId === undefined ? run.deps.host.list() : [documentId];
  await Promise.all(
    ids.map((id) => {
      cancelSnapshot(run, id);
      return snapshotQueue(run.state, id, () => writeSnapshot(run, id));
    }),
  );
};

export { flushSnapshots };
