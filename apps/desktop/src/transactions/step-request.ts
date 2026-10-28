/* @layer renderer-app @kind logic */
import type { CommandStep, DocumentId, TransactionRequest } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';

const stepRequest = (host: DocumentHost, documentId: DocumentId, label: string, steps: readonly CommandStep[]): TransactionRequest => ({
  documentId,
  baseRevision: host.view(documentId)?.state.revision ?? 0,
  mode: 'commit',
  origin: 'ui',
  label,
  steps,
  previewPixels: 0,
});

export { stepRequest };
