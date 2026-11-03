/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { NO_FILTER } from '../sheet-manager/manager.constants';
import { managerMemory } from './manager-memory';
import { MANAGER_DEFAULTS } from './manager-store.constants';
import type { ManagerState } from './manager-store.type';
import { useDocumentStore } from './useDocumentStore';

const useManagerStore = create<ManagerState>()((set) => ({
  ...MANAGER_DEFAULTS,
  reset: () => set({ ...MANAGER_DEFAULTS }),
  patch: (change) => set(change),
  patchFilter: (change) => set((state) => ({ filter: { ...state.filter, ...change } })),
  patchAtlas: (change) => set((state) => ({ atlas: { ...state.atlas, ...change } })),
  clearFilters: () => set({ filter: NO_FILTER, query: '' }),
  toggleFolder: (path) =>
    set((state) => ({ collapsed: state.collapsed.includes(path) ? state.collapsed.filter((each) => each !== path) : [...state.collapsed, path] })),
  saveSelection: (selection) => set((state) => ({ selections: [...state.selections.filter((each) => each.name !== selection.name), selection] })),
  dropSelection: (name) => set((state) => ({ selections: state.selections.filter((each) => each.name !== name) })),
}));

useDocumentStore.subscribe((state, previous) => {
  if (state.activeId !== previous.activeId) {
    managerMemory.remember(previous.activeId, useManagerStore.getState());
    useManagerStore.setState(managerMemory.recall(state.activeId));
  }
  for (const id of previous.order.filter((each) => !state.order.includes(each))) managerMemory.forget(id);
});

export { useManagerStore };
