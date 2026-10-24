/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { SnapshotMeta } from '@drizztdourden08/brock-core';
import { documentName } from '../files/document-name';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useFileStore } from '../stores/useFileStore';

const describeDocument = (documentId: DocumentId): SnapshotMeta => {
  const view = useDocumentStore.getState().host.view(documentId);
  const path = useFileStore.getState().paths[documentId];
  const name = documentName(view?.state.artwork.name ?? '', path);
  return path === undefined ? { name } : { name, path };
};

export { describeDocument };
