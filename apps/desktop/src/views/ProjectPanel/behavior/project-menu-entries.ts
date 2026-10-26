/* @layer renderer-app @kind logic */
import type { ListedEntry } from '@bxel/project';
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import type { AssetRow } from '../../../asset-list/asset-list.type';
import { canCopyForSheet } from '../../../asset-list/can-copy-for-sheet';
import { canDuplicate } from '../../../asset-list/can-duplicate';
import { canExport } from '../../../asset-list/can-export';
import { menuTarget } from '../../../context-menu/menu-target';
import { PROJECT_COMMAND } from '../../../project/project.constants';
import { NEW_ASSET_KINDS, OPENED_KINDS, PROJECT_MENU } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { entryPath } from './entry-path';

const newAssetMenu = (name?: string, hidden = false): ContextMenuEntry => ({
  label: name === undefined ? PROJECT_MENU.newAsset : PROJECT_MENU.newAssetHere,
  hidden,
  items: NEW_ASSET_KINDS.map((kind) => ({ command: 'project.new_asset', label: ASSET_LIST_TEXT.newKinds[kind], args: { kind, name } })),
});

const assetEntries = (row: AssetRow): readonly ContextMenuEntry[] => {
  const args = { rowId: row.id };
  const sheetUser = row.kind === 'sprite' && row.usedBy.length > 0;
  return [
    { command: 'asset.open', label: ASSET_LIST_TEXT.open, args },
    { command: 'asset.rename', label: ASSET_LIST_TEXT.rename, args },
    { command: 'asset.duplicate', label: ASSET_LIST_TEXT.duplicate, args, hidden: !canDuplicate(row) },
    { command: 'asset.copy_for_sheet', label: ASSET_LIST_TEXT.copyForSheet, args, hidden: !canCopyForSheet(row) },
    { command: 'asset.export', label: PROJECT_MENU.export, args, hidden: !canExport(row) },
    { command: 'asset.show_users', label: PROJECT_MENU.showUsers, args, hidden: !sheetUser },
    { command: 'asset.reveal', label: ASSET_LIST_TEXT.reveal, args: { path: row.path }, hidden: row.path === '' },
    { command: 'asset.copy_path', label: ASSET_LIST_TEXT.copyPath, args: { path: row.path }, hidden: row.path === '' },
    'separator',
    { command: 'project.trash_entry', label: ASSET_LIST_TEXT.trash, args, tone: 'danger' },
  ];
};

const folderEntries = (model: ProjectPanelModel, entry: ListedEntry): readonly ContextMenuEntry[] => {
  const args = { name: entry.name };
  const path = entryPath(model, entry);
  const isFolder = entry.kind === 'folder';
  return [
    { command: 'project.open_entry', label: ASSET_LIST_TEXT.open, args, hidden: !isFolder && !OPENED_KINDS.includes(entry.kind) },
    newAssetMenu(entry.name, !isFolder || path === ''),
    { command: 'project.new_folder', label: PROJECT_MENU.newFolderHere, args, hidden: !isFolder || path === '' },
    { command: 'project.rename_entry', label: ASSET_LIST_TEXT.rename, args },
    { command: 'asset.reveal', label: ASSET_LIST_TEXT.reveal, args: { path }, hidden: path === '' },
    { command: 'asset.copy_path', label: ASSET_LIST_TEXT.copyPath, args: { path }, hidden: path === '' },
    'separator',
    { command: 'project.trash_entry', label: PROJECT_MENU.trash, args, tone: 'danger' },
  ];
};

const backgroundEntries: readonly ContextMenuEntry[] = [
  newAssetMenu(),
  { command: 'project.new_folder', label: PROJECT_MENU.newFolder },
  { command: 'project.refresh', label: PROJECT_MENU.refresh },
  { command: 'project.reveal_root', label: PROJECT_MENU.revealRoot },
  PROJECT_COMMAND.settings,
  PROJECT_COMMAND.pack,
  'separator',
  PROJECT_COMMAND.close,
];

const projectMenuEntries = (context: ContextMenuContext, model: ProjectPanelModel): readonly ContextMenuEntry[] => {
  const rowId = menuTarget(context, PROJECT_MENU.assetRow)?.dataset.assetId;
  const name = menuTarget(context, PROJECT_MENU.entryRow)?.dataset.entryName;
  const row = rowId === undefined ? undefined : model.assets.rows.find((each) => each.id === rowId);
  const entry = name === undefined ? undefined : model.listing?.entries.find((each) => each.name === name);
  if (row) return assetEntries(row);
  if (entry) return folderEntries(model, entry);
  return backgroundEntries;
};

export { projectMenuEntries };
