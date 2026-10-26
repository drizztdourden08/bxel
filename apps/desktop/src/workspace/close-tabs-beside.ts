/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { closeTab } from './close-tab';
import { tabIndex } from './tab-index';

const closeTabsBeside = async (tabId: string, side: 'others' | 'right'): Promise<void> => {
  const at = tabIndex(tabId);
  const doomed = useWorkspaceStore
    .getState()
    .tabs.filter((tab, index) => tab.id !== tabId && (side === 'others' || index > at))
    .map((tab) => tab.id);
  for (const id of doomed) await closeTab(id);
};

export { closeTabsBeside };
