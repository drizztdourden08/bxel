/* @layer renderer-app @kind logic */
import type { HostChange } from '../documents/document-host.type';
import type { DocumentSlice } from './document-store.type';

const applyHostChange = (slice: DocumentSlice, change: HostChange): DocumentSlice => {
  if (change.kind === 'open') return { ...slice, order: change.ids, activeId: change.documentId };
  const views = Object.fromEntries(Object.entries(slice.views).filter(([id]) => id !== change.documentId));
  const activeId = slice.activeId === change.documentId ? (change.ids.at(-1) ?? null) : slice.activeId;
  return { views, order: change.ids, activeId };
};

export { applyHostChange };
