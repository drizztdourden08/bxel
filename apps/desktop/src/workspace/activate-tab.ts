/* @layer renderer-app @kind logic */
import { useFileTypePanelStore } from '../stores/useFileTypePanelStore';
import { useImageTabStore } from '../stores/useImageTabStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { focusTab } from './focus-tab';

const activateTab = (tabId: string): void => {
  useFileTypePanelStore.getState().hide();
  const images = useImageTabStore.getState();
  if (images.tabs.some((each) => each.id === tabId)) {
    images.activate(tabId);
    return;
  }
  const tab = useWorkspaceStore.getState().tabs.find((each) => each.id === tabId);
  if (tab) focusTab(tab);
};

export { activateTab };
