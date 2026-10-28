/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ImageTabState } from './image-tab-store.type';

const useImageTabStore = create<ImageTabState>()((set) => ({
  tabs: [],
  activeId: null,
  open: (tab) => set((state) => ({ tabs: state.tabs.some((each) => each.id === tab.id) ? state.tabs : [...state.tabs, tab], activeId: tab.id })),
  activate: (activeId) => set({ activeId }),
  close: (id) => set((state) => ({ tabs: state.tabs.filter((each) => each.id !== id), activeId: state.activeId === id ? null : state.activeId })),
}));

export { useImageTabStore };
