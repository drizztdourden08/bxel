/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const settleEngine = (host: DocumentHost, documentId: DocumentId): void => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  if (workspace?.dirty.size === 0 && host.view(documentId)?.clean === false) host.markSaved(documentId);
};

export { settleEngine };
