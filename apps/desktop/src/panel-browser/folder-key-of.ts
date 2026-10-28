/* @layer renderer-app @kind logic */
import { isExpandable } from './is-expandable';
import type { BrowserItem, ItemTree } from './project-browser.type';

const folderKeyOf = (item: BrowserItem | undefined, tree: ItemTree): string | null => {
  if (item === undefined || item.role === 'group') return null;
  if (isExpandable(item)) return item.key;
  const parent = item.parentKey === null ? undefined : tree.items.get(item.parentKey);
  return parent !== undefined && isExpandable(parent) && parent.role !== 'group' ? parent.key : null;
};

export { folderKeyOf };
