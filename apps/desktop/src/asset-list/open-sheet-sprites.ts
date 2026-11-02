/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useDocumentStore } from '../stores/useDocumentStore';
import { focusTab } from '../workspace/focus-tab';
import { tabOf } from '../workspace/tab-of';
import type { AssetRow } from './asset-list.type';
import { KIND_MENU, OPEN_SPRITES_LIMIT } from './kind-menu.constants';
import { rowTab } from './row-tab';

const openSheetSprites = (row: AssetRow): void => {
  const tab = rowTab(row);
  if (!tab) return;
  const sheet = useDocumentStore.getState().host.view(tab.documentId)?.state.artwork.sheets.find((each) => each.id === tab.key.id);
  const ids = [...new Set(sheet?.entries.map((entry) => entry.spriteId) ?? [])];
  for (const id of ids.slice(0, OPEN_SPRITES_LIMIT)) focusTab(tabOf(tab.documentId, { kind: 'sprite', id }));
  if (ids.length > OPEN_SPRITES_LIMIT) toast(KIND_MENU.openedLimit(OPEN_SPRITES_LIMIT), { variant: 'info' });
};

export { openSheetSprites };
