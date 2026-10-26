/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { tabIndex } from './tab-index';

const moveTabBy = (tabId: string, by: 1 | -1): void => {
  const at = tabIndex(tabId);
  if (at >= 0) useWorkspaceStore.getState().moveTab(at, at + by);
};

export { moveTabBy };
