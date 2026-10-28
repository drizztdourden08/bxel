/* @layer renderer-app @kind logic */
import { canDuplicate } from '../asset-list/can-duplicate';
import { duplicateRow } from '../asset-list/duplicate-row';
import type { BrowserItem } from './project-browser.type';

const duplicateItems = (items: readonly BrowserItem[]): void => {
  for (const item of items) if (item.row !== null && canDuplicate(item.row)) duplicateRow(item.row);
};

export { duplicateItems };
