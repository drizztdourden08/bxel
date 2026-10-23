/* @layer renderer-app @kind hook */
import type { DocumentView } from '../documents/document-host.type';
import { useDocumentStore } from '../stores/useDocumentStore';

const useActiveDocument = (): DocumentView | null =>
  useDocumentStore((state) => (state.activeId === null ? null : (state.views[state.activeId] ?? null)));

export { useActiveDocument };
