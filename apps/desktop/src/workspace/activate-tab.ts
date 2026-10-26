/* @layer renderer-app @kind logic */
import { useFileTypePanelStore } from '../stores/useFileTypePanelStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { focusTab } from './focus-tab';

const activateTab = (tabId: string): void => {
  useFileTypePanelStore.getState().hide();
  const tab = useWorkspaceStore.getState().tabs.find((each) => each.id === tabId);
  if (tab) focusTab(tab);
};

export { activateTab };
