/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { canCopyForSheet } from '../../../asset-list/can-copy-for-sheet';
import { canDuplicate } from '../../../asset-list/can-duplicate';
import { canExport } from '../../../asset-list/can-export';
import type { BrowserItem, ItemStatus } from '../../../project-browser/project-browser.type';
import { PROJECT_MENU } from '../ProjectPanel.constants';

const assetEntries = (item: BrowserItem, status: ItemStatus): readonly ContextMenuEntry[] => {
  const { row } = item;
  const args = { key: item.key, path: item.path };
  const hasPath = item.path !== '';
  return [
    { command: 'asset.open', label: ASSET_LIST_TEXT.open, args },
    { command: 'project.rename_entry', label: ASSET_LIST_TEXT.rename, args },
    { command: 'asset.duplicate', label: ASSET_LIST_TEXT.duplicate, args, hidden: row === null || !canDuplicate(row) },
    { command: 'asset.copy_for_sheet', label: ASSET_LIST_TEXT.copyForSheet, args, hidden: row === null || !canCopyForSheet(row) },
    { command: 'asset.show_users', label: PROJECT_MENU.showUsers, args, hidden: status.usedBy === 0 },
    { command: 'asset.export', label: PROJECT_MENU.export, args, hidden: row === null || !canExport(row) },
    'separator',
    { command: 'asset.reveal', label: ASSET_LIST_TEXT.reveal, args: { path: item.path }, hidden: !hasPath },
    { command: 'asset.copy_path', label: ASSET_LIST_TEXT.copyPath, args: { path: item.path }, hidden: !hasPath },
    { command: 'asset.copy_relative_path', label: PROJECT_MENU.copyRelative, args, hidden: !hasPath },
    'separator',
    { command: 'project.trash_entry', label: PROJECT_MENU.trash, args, tone: 'danger' },
  ];
};

export { assetEntries };
