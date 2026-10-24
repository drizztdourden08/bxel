/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { NO_FILTER } from '../sheet-manager/manager.constants';
import { MANAGER_DEFAULTS } from './manager-store.constants';
import type { ManagerState } from './manager-store.type';
import { useDocumentStore } from './useDocumentStore';

const useManagerStore = create<ManagerState>()((set) => ({
  ...MANAGER_DEFAULTS,
  reset: () => set((state) => ({ ...MANAGER_DEFAULTS, view: state.view, zoom: state.zoom })),
  patch: (change) => set(change),
  patchFilter: (change) => set((state) => ({ filter: { ...state.filter, ...change } })),
  patchAtlas: (change) => set((state) => ({ atlas: { ...state.atlas, ...change } })),
  clearFilters: () => set({ filter: NO_FILTER, query: '' }),
}));

useDocumentStore.subscribe((state, previous) => {
  if (state.activeId !== previous.activeId) useManagerStore.getState().reset();
});

export { useManagerStore };
