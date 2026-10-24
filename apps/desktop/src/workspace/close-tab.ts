/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { closeWorkspace } from './close-workspace';
import { focusTab } from './focus-tab';

const closeTab = async (tabId: string): Promise<void> => {
  const store = useWorkspaceStore.getState();
  const tab = store.tabs.find((each) => each.id === tabId);
  if (!tab) return;
  const workspace = store.workspaces[tab.documentId];
  const siblings = store.tabs.filter((each) => each.documentId === tab.documentId && each.id !== tabId);
  if (siblings.length === 0 && workspace?.kind !== 'project') {
    await closeWorkspace(tab.documentId);
    return;
  }
  const index = store.tabs.findIndex((each) => each.id === tabId);
  store.closeTab(tabId);
  if (store.activeTab !== tabId) return;
  const rest = useWorkspaceStore.getState().tabs;
  const next = rest[Math.min(index, rest.length - 1)];
  if (next) focusTab(next);
  else store.setActiveTab(null);
};

export { closeTab };
