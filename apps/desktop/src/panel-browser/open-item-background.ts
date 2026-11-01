/* @layer renderer-app @kind logic */
import { openRowBackground } from '../asset-list/open-row-background';
import { isExpandable } from './is-expandable';
import { openItem } from './open-item';
import type { BrowserItem } from './project-browser.type';

const openItemBackground = (item: BrowserItem): void => {
  if (isExpandable(item)) return;
  if (item.row !== null) openRowBackground(item.row);
  else openItem(item);
};

export { openItemBackground };
