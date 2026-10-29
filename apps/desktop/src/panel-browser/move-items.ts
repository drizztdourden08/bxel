/* @layer renderer-app @kind logic */
import { moveEntries } from '../file-ops/move-entries';
import type { BrowserItem } from './project-browser.type';

const movable = (item: BrowserItem, folder: BrowserItem): boolean => item.path !== '' && item.role !== 'ghost' && item.role !== 'linked' && item.key !== folder.key;

const moveItems = async (items: readonly BrowserItem[], folder: BrowserItem): Promise<void> => {
  const paths = items.filter((item) => movable(item, folder)).map((item) => item.path);
  if (paths.length > 0) await moveEntries(paths, folder.path);
};

export { moveItems };
