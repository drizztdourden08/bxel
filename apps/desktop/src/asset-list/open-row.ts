/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import { runFileAction } from '../files/run-file-action';
import { useAssistantChangedStore } from '../stores/useAssistantChangedStore';
import { focusTab } from '../workspace/focus-tab';
import type { AssetRow } from './asset-list.type';
import { openImage } from './open-image';
import { rowTab } from './row-tab';

const openRow = (row: AssetRow): void => {
  if (row.assetId !== null) useAssistantChangedStore.getState().clear(row.assetId);
  const tab = rowTab(row);
  if (tab) {
    focusTab(tab);
    return;
  }
  if (row.kind === 'image') void openImage(row.path);
  else if (row.kind !== 'other' || entryKindOf(row.name) === 'legacy') void runFileAction({ kind: 'openPath', path: row.path });
};

export { openRow };
