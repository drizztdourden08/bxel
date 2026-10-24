/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { SnapshotMeta } from '@drizztdourden08/brock-core';
import { fileName } from '../files/file-name';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useFileStore } from '../stores/useFileStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const describeDocument = (documentId: DocumentId): SnapshotMeta => {
  const view = useDocumentStore.getState().host.view(documentId);
  const path = useFileStore.getState().paths[documentId];
  const name = path === undefined ? (useWorkspaceStore.getState().workspaces[documentId]?.name ?? view?.state.artwork.name ?? '') : fileName(path);
  return path === undefined ? { name } : { name, path };
};

export { describeDocument };
