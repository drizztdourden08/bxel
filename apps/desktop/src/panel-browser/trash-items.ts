/* @layer renderer-app @kind logic */
import { removeLoadedRows } from '../asset-list/remove-loaded-rows';
import { trashEntries } from '../file-ops/trash-entries';
import type { BrowserItem } from './project-browser.type';

const onDisk = (item: BrowserItem): boolean => item.path !== '' && item.role !== 'ghost' && !(item.row?.loaded ?? false);

const trashItems = async (items: readonly BrowserItem[]): Promise<void> => {
  const loaded = items.flatMap((item) => (item.row?.loaded === true ? [item.row] : []));
  if (loaded.length > 0) removeLoadedRows(loaded);
  const paths = items.filter(onDisk).map((item) => item.path);
  if (paths.length > 0) await trashEntries(paths);
};

export { trashItems };
