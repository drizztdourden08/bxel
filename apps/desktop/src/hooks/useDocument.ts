/* @layer renderer-app @kind hook */
import type { DocumentId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { useDocumentStore } from '../stores/useDocumentStore';

const useDocument = (documentId: DocumentId | null): DocumentView | null =>
  useDocumentStore((state) => (documentId === null ? null : (state.views[documentId] ?? null)));

export { useDocument };
