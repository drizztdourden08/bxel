/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { moveItem } from '../workspace/move-item';
import type { WorkspaceState } from './workspace-store.type';

const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  workspaces: {},
  tabs: [],
  activeTab: null,
  loading: null,
  splitting: null,
  put: (workspace, tabs) =>
    set((state) => ({
      workspaces: { ...state.workspaces, [workspace.documentId]: workspace },
      tabs: [...state.tabs.filter((tab) => tab.documentId !== workspace.documentId), ...tabs],
    })),
  patch: (documentId, change) =>
    set((state) => {
      const workspace = state.workspaces[documentId];
      return workspace ? { workspaces: { ...state.workspaces, [documentId]: change(workspace) } } : state;
    }),
  drop: (documentId) =>
    set((state) => {
      const tabs = state.tabs.filter((tab) => tab.documentId !== documentId);
      const activeTab = tabs.some((tab) => tab.id === state.activeTab) ? state.activeTab : (tabs.at(-1)?.id ?? null);
      return {
        workspaces: Object.fromEntries(Object.entries(state.workspaces).filter(([id]) => id !== documentId)),
        tabs,
        activeTab,
        splitting: state.splitting === documentId ? null : state.splitting,
      };
    }),
  addTab: (tab) => set((state) => (state.tabs.some((each) => each.id === tab.id) ? state : { tabs: [...state.tabs, tab] })),
  closeTab: (tabId) => set((state) => ({ tabs: state.tabs.filter((tab) => tab.id !== tabId) })),
  moveTab: (from, to) => set((state) => ({ tabs: moveItem(state.tabs, from, to) })),
  setActiveTab: (activeTab) => set({ activeTab }),
  setLoading: (loading) => set({ loading }),
  showSplit: (splitting) => set({ splitting }),
}));

export { useWorkspaceStore };
