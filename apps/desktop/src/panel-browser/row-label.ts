/* @layer renderer-app @kind logic */
import type { BrowserItem, ItemStatus } from './project-browser.type';

const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`;

const missingNote = (item: BrowserItem, status: ItemStatus): readonly string[] => {
  if (item.role === 'ghost') return ['file missing'];
  return status.missing.length > 0 ? [`missing ${status.missing.join(' and ')}`] : [];
};

const folderNotes = (item: BrowserItem, status: ItemStatus): readonly string[] => [
  ...(item.role === 'linked' ? ['linked folder'] : []),
  ...(item.readOnly ? ['read only'] : []),
  ...(status.unsavedBelow > 0 ? [`${status.unsavedBelow} unsaved inside`] : []),
  ...(status.missingBelow > 0 ? [`${status.missingBelow} with missing links inside`] : []),
];

const fileNotes = (item: BrowserItem, status: ItemStatus): readonly string[] => [
  ...(status.unsaved ? ['unsaved'] : []),
  ...(status.open ? ['open'] : []),
  ...missingNote(item, status),
  ...(status.usedBy > 0 ? [`used by ${plural(status.usedBy, 'asset')}`] : []),
  ...(status.unused ? ['unused'] : []),
];

const rowLabel = (item: BrowserItem, status: ItemStatus, expandable: boolean): string => {
  const notes = expandable ? folderNotes(item, status) : fileNotes(item, status);
  const head = expandable ? `${item.name}, ${item.role === 'group' ? 'group' : 'folder'}` : item.fileName || item.name;
  return [head, ...notes].join(', ');
};

export { rowLabel };
