/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const tabPath = (tabId: string): string | undefined => {
  const { tabs, workspaces } = useWorkspaceStore.getState();
  const tab = tabs.find((each) => each.id === tabId);
  return tab ? workspaces[tab.documentId]?.paths.get(tab.key.id) : undefined;
};

export { tabPath };
