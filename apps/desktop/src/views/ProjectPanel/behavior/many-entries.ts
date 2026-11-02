/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { canDuplicate } from '../../../asset-list/can-duplicate';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { PROJECT_MENU } from '../ProjectPanel.constants';
import { spriteIdsOf } from './sprite-ids-of';

const manyEntries = (targets: readonly BrowserItem[]): readonly ContextMenuEntry[] => {
  const args = { key: targets[0]?.key };
  const files = targets.filter((item) => item.role === 'file' || item.role === 'ghost');
  const copies = files.filter((item) => item.row !== null && canDuplicate(item.row));
  const movable = targets.some((item) => item.path !== '' && !item.readOnly && item.role !== 'ghost' && item.role !== 'group' && item.role !== 'linked');
  const sprites = spriteIdsOf(targets).length;
  return [
    { command: 'asset.open', label: PROJECT_MENU.openAll, args, hidden: files.length === 0 },
    { command: 'asset.duplicate', label: PROJECT_MENU.duplicateMany(copies.length), args, hidden: copies.length === 0 },
    { command: 'asset.move_to', label: PROJECT_MENU.moveTo, args, hidden: !movable },
    { command: 'project.new_sheet_from', label: PROJECT_MENU.newSheetFrom, args, hidden: sprites === 0 },
    { command: 'project.new_animation_from', label: PROJECT_MENU.newAnimationFrom, args, hidden: sprites === 0 },
    'separator',
    { command: 'project.trash_entry', label: PROJECT_MENU.trashMany(targets.length), args, tone: 'danger' },
  ];
};

export { manyEntries };
