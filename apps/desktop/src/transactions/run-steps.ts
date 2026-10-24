/* @layer renderer-app @kind logic */
import type { CommandStep, DocumentId, TransactionResult } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';

const runSteps = (host: DocumentHost, documentId: DocumentId, label: string, steps: readonly CommandStep[]): TransactionResult =>
  host.execute({
    documentId,
    baseRevision: host.view(documentId)?.state.revision ?? 0,
    mode: 'commit',
    origin: 'ui',
    label,
    steps,
    previewPixels: 0,
  });

export { runSteps };
