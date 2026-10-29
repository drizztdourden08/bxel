/* @layer renderer-app @kind logic */
import { canDuplicate } from '../asset-list/can-duplicate';
import { duplicateFile } from '../asset-list/duplicate-file';
import { duplicateRow } from '../asset-list/duplicate-row';
import type { AssetRow } from '../asset-list/asset-list.type';
import type { BrowserItem } from './project-browser.type';

const duplicateOne = async (row: AssetRow): Promise<void> => {
  if (row.loaded) duplicateRow(row);
  else await duplicateFile(row);
};

const duplicateItems = async (items: readonly BrowserItem[], refresh: () => void): Promise<void> => {
  const rows = items.flatMap((item) => (item.row !== null && canDuplicate(item.row) ? [item.row] : []));
  await Promise.all(rows.map(duplicateOne));
  refresh();
};

export { duplicateItems };
