/* @layer renderer-app @kind logic */
import type { DocumentHost } from '../documents/document-host.type';
import { useFileStore } from '../stores/useFileStore';
import type { PathBook } from './files.type';

const storePathBook = (host: DocumentHost): PathBook => ({
  pathOf: (documentId) => useFileStore.getState().paths[documentId],
  documentAt: (path) => host.list().find((documentId) => useFileStore.getState().paths[documentId] === path),
  remember: (documentId, path) => useFileStore.getState().remember(documentId, path),
});

export { storePathBook };
