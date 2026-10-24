/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { artworkBytes } from '../files/artwork-bytes';
import type { RecoveryRun } from './recovery.type';

const writeSnapshot = async ({ deps, state }: RecoveryRun, documentId: DocumentId): Promise<void> => {
  const view = deps.host.view(documentId);
  if (view === null || view.clean || view.state.readOnly) return;
  await deps.sink.snapshot(documentId, artworkBytes(view.state, deps.clock), deps.describe(documentId));
  state.written.add(documentId);
  state.lastWrite.set(documentId, deps.now());
};

export { writeSnapshot };
