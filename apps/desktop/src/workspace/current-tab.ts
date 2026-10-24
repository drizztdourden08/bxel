/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { firstTabKey } from './first-tab-key';
import { tabOf } from './tab-of';
import type { OpenTab } from './workspace.type';

const currentTab = (): OpenTab | null => {
  const { activeId, host } = useDocumentStore.getState();
  if (activeId === null) return null;
  const { tabs, activeTab } = useWorkspaceStore.getState();
  const active = tabs.find((tab) => tab.id === activeTab && tab.documentId === activeId);
  if (active) return active;
  const first = tabs.find((tab) => tab.documentId === activeId);
  if (first) return first;
  const artwork = host.view(activeId)?.state.artwork;
  const key = artwork ? firstTabKey(artwork) : null;
  return key ? tabOf(activeId, key) : null;
};

export { currentTab };
