/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { currentTab } from '../workspace/current-tab';
import type { AssetFocus } from './asset-config.type';

const focusedAsset = (): AssetFocus | null => {
  const { activeId, host } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  const tab = currentTab();
  if (activeId === null || !view || !tab) return null;
  return { documentId: activeId, key: tab.key, artwork: view.state.artwork, readOnly: view.state.readOnly };
};

export { focusedAsset };
