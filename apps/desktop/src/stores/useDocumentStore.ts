/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { createDocumentHost } from '../documents/create-document-host';
import { applyHostChange } from './apply-host-change';
import type { DocumentStoreState } from './document-store.type';

const useDocumentStore = create<DocumentStoreState>()((set) => {
  const host = createDocumentHost();
  host.subscribe((event) => {
    const view = host.view(event.documentId);
    if (view) set((state) => ({ views: { ...state.views, [event.documentId]: view } }));
  });
  host.subscribeChanges((change) => set((state) => applyHostChange(state, change)));
  return {
    host,
    views: {},
    order: [],
    activeId: null,
    setActive: (activeId) => set({ activeId }),
  };
});

export { useDocumentStore };
