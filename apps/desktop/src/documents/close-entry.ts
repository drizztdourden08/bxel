/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { HostStore } from './document-host.type';
import { publishChange } from './publish-change';

const closeEntry = (store: HostStore, documentId: DocumentId): boolean => {
  const entry = store.entries.get(documentId);
  if (!entry) return false;
  entry.stop();
  store.entries.delete(documentId);
  publishChange(store, { kind: 'close', documentId, ids: [...store.entries.keys()] });
  return true;
};

export { closeEntry };
