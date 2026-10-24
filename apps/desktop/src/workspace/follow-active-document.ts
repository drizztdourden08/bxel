/* @layer renderer-app @kind logic */
import type { DocumentStoreState } from '../stores/document-store.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { showAsset } from './show-asset';

const followActiveDocument = (state: DocumentStoreState, previous: DocumentStoreState): void => {
  if (state.activeId === previous.activeId || state.activeId === null) return;
  const store = useWorkspaceStore.getState();
  const current = store.tabs.find((tab) => tab.id === store.activeTab);
  if (current?.documentId === state.activeId) return;
  const first = store.tabs.find((tab) => tab.documentId === state.activeId);
  if (!first) return;
  store.setActiveTab(first.id);
  showAsset(first.key);
};

export { followActiveDocument };
