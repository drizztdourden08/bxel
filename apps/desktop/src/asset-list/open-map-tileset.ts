/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { focusTab } from '../workspace/focus-tab';
import { tabOf } from '../workspace/tab-of';
import type { AssetRow } from './asset-list.type';
import { rowTab } from './row-tab';

const openMapTileset = (row: AssetRow): void => {
  const tab = rowTab(row);
  if (!tab) return;
  const map = useDocumentStore.getState().host.view(tab.documentId)?.state.artwork.tilemaps.find((each) => each.id === tab.key.id);
  if (map) focusTab(tabOf(tab.documentId, { kind: 'tileset', id: map.tilesetId }));
};

export { openMapTileset };
