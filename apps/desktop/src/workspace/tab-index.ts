/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const tabIndex = (tabId: string): number => useWorkspaceStore.getState().tabs.findIndex((tab) => tab.id === tabId);

export { tabIndex };
