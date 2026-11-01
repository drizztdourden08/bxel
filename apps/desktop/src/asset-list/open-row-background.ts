/* @layer renderer-app @kind logic */
import { useAssistantChangedStore } from '../stores/useAssistantChangedStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import type { AssetRow } from './asset-list.type';
import { openRow } from './open-row';
import { rowTab } from './row-tab';

const openRowBackground = (row: AssetRow): void => {
  const tab = rowTab(row);
  if (!tab) {
    openRow(row);
    return;
  }
  if (row.assetId !== null) useAssistantChangedStore.getState().clear(row.assetId);
  useWorkspaceStore.getState().addTab(tab);
};

export { openRowBackground };
