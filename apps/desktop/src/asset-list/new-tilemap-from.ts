/* @layer renderer-app @kind logic */
import { useTilemapDialogStore } from '../stores/useTilemapDialogStore';
import { focusTab } from '../workspace/focus-tab';
import type { AssetRow } from './asset-list.type';
import { rowTab } from './row-tab';

const newTilemapFrom = (row: AssetRow): void => {
  const tab = rowTab(row);
  if (!tab) return;
  focusTab(tab);
  useTilemapDialogStore.getState().show('tilemap');
};

export { newTilemapFrom };
