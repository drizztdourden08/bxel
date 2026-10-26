/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const settleEngine = (host: DocumentHost, documentId: DocumentId): void => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const view = host.view(documentId);
  if (!workspace || !view) return;
  if (workspace.dirty.size === 0 && !view.clean) host.markSaved(documentId);
  else if (workspace.dirty.size > 0 && view.clean) host.markUnsaved(documentId);
};

export { settleEngine };
