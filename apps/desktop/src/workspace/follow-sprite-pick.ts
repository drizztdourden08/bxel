/* @layer renderer-app @kind logic */
import type { SpriteState } from '../stores/sprite-store.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetName } from './asset-name';
import { tabOf } from './tab-of';

const followSpritePick = (state: SpriteState, previous: SpriteState): void => {
  if (state.mode !== 'sprite' || state.activeId === null || state.activeId === previous.activeId) return;
  const { activeId, views } = useDocumentStore.getState();
  const artwork = activeId === null ? undefined : views[activeId]?.state.artwork;
  const key = { kind: 'sprite' as const, id: state.activeId };
  if (activeId === null || !artwork || assetName(artwork, key) === null) return;
  const tab = tabOf(activeId, key);
  const store = useWorkspaceStore.getState();
  store.addTab(tab);
  store.setActiveTab(tab.id);
};

export { followSpritePick };
