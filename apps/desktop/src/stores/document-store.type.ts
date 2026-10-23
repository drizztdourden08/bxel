/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { DocumentHost, DocumentView } from '../documents/document-host.type';

interface DocumentSlice {
  views: Readonly<Record<string, DocumentView>>;
  order: readonly DocumentId[];
  activeId: DocumentId | null;
}

interface DocumentStoreState extends DocumentSlice {
  host: DocumentHost;
  setActive: (documentId: DocumentId | null) => void;
}

export type { DocumentSlice, DocumentStoreState };
