/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { canDuplicate } from '../../../asset-list/can-duplicate';
import { canExport } from '../../../asset-list/can-export';
import { exportLabel } from '../../../asset-list/export-label';
import { KIND_MENU } from '../../../asset-list/kind-menu.constants';
import type { BrowserItem, ItemStatus } from '../../../panel-browser/project-browser.type';
import { PROJECT_MENU } from '../ProjectPanel.constants';
import { kindGroupEntries } from './kind-group-entries';

const assetEntries = (item: BrowserItem, status: ItemStatus, uses: number): readonly ContextMenuEntry[] => {
  const { row } = item;
  const args = { key: item.key, path: item.path };
  const hasPath = item.path !== '';
  return [
    { command: 'asset.open', label: ASSET_LIST_TEXT.open, args },
    { command: 'asset.open_side', label: PROJECT_MENU.openSide, args },
    { command: 'project.rename_entry', label: ASSET_LIST_TEXT.rename, args },
    { command: 'asset.duplicate', label: row?.kind === 'palette' ? KIND_MENU.duplicateVariant : ASSET_LIST_TEXT.duplicate, args, hidden: row === null || !canDuplicate(row) },
    { command: 'asset.move_to', label: PROJECT_MENU.moveTo, args, hidden: !hasPath || item.readOnly },
    ...kindGroupEntries(item),
    { command: 'asset.show_users', label: PROJECT_MENU.showUsers, args, hidden: status.usedBy === 0 },
    { command: 'asset.show_uses', label: PROJECT_MENU.showUses, args, hidden: uses === 0 },
    { command: 'asset.export', label: exportLabel(row, PROJECT_MENU.export), args, hidden: row === null || !canExport(row) },
    'separator',
    { command: 'asset.reveal', label: ASSET_LIST_TEXT.reveal, args: { path: item.path }, hidden: !hasPath },
    { command: 'asset.copy_path', label: ASSET_LIST_TEXT.copyPath, args: { path: item.path }, hidden: !hasPath },
    { command: 'asset.copy_relative_path', label: PROJECT_MENU.copyRelative, args, hidden: !hasPath },
    'separator',
    { command: 'project.trash_entry', label: PROJECT_MENU.trash, args, tone: 'danger' },
  ];
};

export { assetEntries };
