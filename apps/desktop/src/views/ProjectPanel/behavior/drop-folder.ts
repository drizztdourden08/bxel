/* @layer renderer-app @kind logic */
import { isExpandable } from '../../../panel-browser/is-expandable';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';

const dropFolder = (item: BrowserItem | undefined): BrowserItem | undefined =>
  item !== undefined && isExpandable(item) && item.role !== 'group' && !item.readOnly && item.path !== '' ? item : undefined;

export { dropFolder };
