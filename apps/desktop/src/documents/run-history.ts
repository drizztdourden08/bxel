/* @layer renderer-app @kind logic */
import type { DocumentId, TransactionResult } from '@bxel/document';
import type { HostStore } from './document-host.type';
import { missingDocument } from './missing-document';

const runHistory = (store: HostStore, documentId: DocumentId, direction: 'undo' | 'redo'): TransactionResult => {
  const entry = store.entries.get(documentId);
  if (!entry) return missingDocument(documentId, 0);
  const request = { documentId, expectedRevision: entry.engine.state().revision };
  return direction === 'undo' ? entry.engine.undo(request) : entry.engine.redo(request);
};

export { runHistory };
