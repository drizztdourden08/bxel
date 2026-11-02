/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { activeSheetOf } from '../../../asset-list/active-sheet-of';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { canCopyForSheet } from '../../../asset-list/can-copy-for-sheet';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { PROJECT_MENU } from '../ProjectPanel.constants';

const onSheet = (item: BrowserItem): boolean => activeSheetOf()?.sheet.entries.some((entry) => entry.spriteId === item.row?.assetId) ?? false;

const kindGroupEntries = (item: BrowserItem): readonly ContextMenuEntry[] => {
  const { row } = item;
  const args = { key: item.key, path: item.path };
  const sprite = row !== null && row.kind === 'sprite' && row.loaded && item.role === 'file';
  return [
    { command: 'asset.add_to_sheet', label: PROJECT_MENU.addToSheet, args, hidden: !sprite || activeSheetOf() === null || onSheet(item) },
    { command: 'asset.copy_for_sheet', label: ASSET_LIST_TEXT.copyForSheet, args, hidden: row === null || !canCopyForSheet(row) },
    { command: 'asset.make_animation', label: PROJECT_MENU.makeAnimation, args, hidden: !sprite },
  ];
};

export { kindGroupEntries };
