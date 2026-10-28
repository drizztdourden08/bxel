/* @layer renderer-app @kind logic */
import type { CommandStep, DocumentId, TransactionMode, TransactionResult } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';

const runSteps = (host: DocumentHost, documentId: DocumentId, label: string, steps: readonly CommandStep[], mode: TransactionMode = 'commit'): TransactionResult =>
  host.execute({
    documentId,
    baseRevision: host.view(documentId)?.state.revision ?? 0,
    mode,
    origin: 'ui',
    label,
    steps,
    previewPixels: 0,
  });

export { runSteps };
