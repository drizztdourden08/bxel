/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetName } from './asset-name';
import { tabOf } from './tab-of';

const pickTab = (key: AssetKey): void => {
  const { activeId, views } = useDocumentStore.getState();
  const artwork = activeId === null ? undefined : views[activeId]?.state.artwork;
  if (activeId === null || !artwork || assetName(artwork, key) === null) return;
  const tab = tabOf(activeId, key);
  const store = useWorkspaceStore.getState();
  store.addTab(tab);
  store.setActiveTab(tab.id);
};

export { pickTab };
