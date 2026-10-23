/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';

const markIfUnchanged = (host: DocumentHost, documentId: DocumentId, savedRevision: number): void => {
  if (host.view(documentId)?.state.revision === savedRevision) host.markSaved(documentId);
};

export { markIfUnchanged };
