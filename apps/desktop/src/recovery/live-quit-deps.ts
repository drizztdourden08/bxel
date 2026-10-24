/* @layer renderer-app @kind logic */
import { saveForQuit } from '../files/save-for-quit';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { askToSave } from './ask-to-save';
import { dirtyDocuments } from './dirty-documents';
import type { QuitDeps } from './recovery.type';
import { recoveryService } from './recovery-service';

const liveQuitDeps: QuitDeps = {
  dirty: () => {
    const { views, order } = useDocumentStore.getState();
    return dirtyDocuments(views, order, useWorkspaceStore.getState().workspaces);
  },
  flush: () => recoveryService.flush(),
  ask: askToSave,
  save: saveForQuit,
  discard: (documentId) => recoveryService.discard(documentId),
};

export { liveQuitDeps };
