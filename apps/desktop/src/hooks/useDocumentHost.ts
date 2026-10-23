/* @layer renderer-app @kind hook */
import type { DocumentHost } from '../documents/document-host.type';
import { useDocumentStore } from '../stores/useDocumentStore';

const useDocumentHost = (): DocumentHost => useDocumentStore((state) => state.host);

export { useDocumentHost };
