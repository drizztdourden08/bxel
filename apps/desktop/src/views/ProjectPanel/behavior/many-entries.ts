/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { canDuplicate } from '../../../asset-list/can-duplicate';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { PROJECT_MENU } from '../ProjectPanel.constants';

const manyEntries = (targets: readonly BrowserItem[]): readonly ContextMenuEntry[] => {
  const args = { key: targets[0]?.key };
  const files = targets.filter((item) => item.role === 'file' || item.role === 'ghost');
  const copies = files.filter((item) => item.row !== null && canDuplicate(item.row));
  return [
    { command: 'asset.open', label: PROJECT_MENU.openAll, args, hidden: files.length === 0 },
    { command: 'asset.duplicate', label: PROJECT_MENU.duplicateMany(copies.length), args, hidden: copies.length === 0 },
    'separator',
    { command: 'project.trash_entry', label: PROJECT_MENU.trashMany(targets.length), args, tone: 'danger' },
  ];
};

export { manyEntries };
