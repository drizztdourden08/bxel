/* @layer renderer-app @kind logic */
import { addToSheet } from '../../../sheet-manager/add-to-sheet';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { spriteIdsOf } from './sprite-ids-of';

const newSheetFrom = (items: readonly BrowserItem[]): void => {
  const ids = spriteIdsOf(items);
  if (ids.length > 0) addToSheet(ids, null);
};

export { newSheetFrom };
