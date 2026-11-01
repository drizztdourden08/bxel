/* @layer renderer-app @kind logic */
import type { BrowserItem, ItemStatus } from '../../../../../panel-browser/project-browser.type';
import type { BadgeMarks } from '../ProjectTree.type';

const usersText = (count: number): string => (count === 1 ? 'Used by 1 asset. Press to show it.' : `Used by ${count} assets. Press to show them.`);

const missingText = (status: ItemStatus, folderLike: boolean): string | null => {
  if (folderLike) return status.missingBelow > 0 ? `${status.missingBelow} with missing links inside` : null;
  return status.missing.length > 0 ? `Missing: ${status.missing.join(', ')}` : null;
};

const badgeMarks = (item: BrowserItem, status: ItemStatus): BadgeMarks => {
  const folderLike = item.kind === 'folder' || item.role === 'group';
  return {
    readOnly: item.readOnly,
    legacy: item.kind === 'legacy',
    missing: missingText(status, folderLike),
    unsaved: folderLike ? status.unsavedBelow > 0 : status.unsaved,
    open: status.open && !folderLike,
    users: folderLike ? null : usersText(status.usedBy),
    usedBy: folderLike ? 0 : status.usedBy,
  };
};

export { badgeMarks };
