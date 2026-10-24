/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { decideQuit } from '../recovery/decide-quit';
import { liveQuitDeps } from '../recovery/live-quit-deps';
import { useDocumentStore } from '../stores/useDocumentStore';

const closeWorkspace = async (documentId: DocumentId): Promise<boolean> => {
  const decision = await decideQuit({ ...liveQuitDeps, dirty: () => liveQuitDeps.dirty().filter((each) => each.documentId === documentId) });
  if (decision === 'stay') return false;
  useDocumentStore.getState().host.close(documentId);
  return true;
};

export { closeWorkspace };
