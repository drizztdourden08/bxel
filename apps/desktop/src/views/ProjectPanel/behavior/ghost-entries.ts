/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import type { BrowserItem, ItemStatus } from '../../../panel-browser/project-browser.type';
import { PROJECT_MENU } from '../ProjectPanel.constants';

const ghostEntries = (item: BrowserItem, status: ItemStatus): readonly ContextMenuEntry[] => {
  const args = { key: item.key, path: item.path };
  return [
    { command: 'asset.locate', label: PROJECT_MENU.locate, args },
    { command: 'asset.remove_link', label: PROJECT_MENU.removeLink, args },
    { command: 'asset.show_users', label: PROJECT_MENU.showUsers, args, hidden: status.usedBy === 0 },
    { command: 'asset.copy_path', label: ASSET_LIST_TEXT.copyPath, args: { path: item.path } },
    { command: 'asset.copy_relative_path', label: PROJECT_MENU.copyRelative, args },
  ];
};

export { ghostEntries };
