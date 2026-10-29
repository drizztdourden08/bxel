/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { useDocumentStore } from '../../stores/useDocumentStore';

const newestTag = (documentId: DocumentId): number => useDocumentStore.getState().host.view(documentId)?.newest?.id ?? 0;

export { newestTag };
