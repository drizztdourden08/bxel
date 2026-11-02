/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { PROJECT_MENU } from '../ProjectPanel.constants';
import { newAssetEntry } from './new-asset-entry';

const folderEntries = (item: BrowserItem): readonly ContextMenuEntry[] => {
  const args = { key: item.key, path: item.path };
  const linked = item.role === 'linked';
  const writable = !item.readOnly;
  return [
    { command: 'project.open_entry', label: 'Open', args },
    newAssetEntry(PROJECT_MENU.newAssetHere, item.key, !writable),
    { command: 'project.new_folder', label: PROJECT_MENU.newFolderHere, args, hidden: !writable },
    { command: 'project.rename_entry', label: ASSET_LIST_TEXT.rename, args, hidden: linked },
    { command: 'project.collapse_below', label: PROJECT_MENU.collapseBelow, args },
    'separator',
    { command: 'asset.reveal', label: ASSET_LIST_TEXT.reveal, args: { path: item.path } },
    { command: 'asset.copy_path', label: ASSET_LIST_TEXT.copyPath, args: { path: item.path } },
    { command: 'asset.copy_relative_path', label: PROJECT_MENU.copyRelative, args, hidden: linked },
    'separator',
    { command: 'project.unlink_folder', label: PROJECT_MENU.unlink, args, hidden: !linked },
    { command: 'project.trash_entry', label: PROJECT_MENU.trash, args, tone: 'danger', hidden: linked },
  ];
};

export { folderEntries };
