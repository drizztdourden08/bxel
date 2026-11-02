/* @layer renderer-app @kind logic */
import type { BrowserItem, ItemTree } from '../../../panel-browser/project-browser.type';

const activeItemOf = (tree: ItemTree, activeKey: string | null): BrowserItem | undefined => {
  if (activeKey === null) return undefined;
  return [...tree.items.values()].find((each) => each.role === 'file' && each.row?.loaded === true && each.row.assetId !== null && `${each.row.kind}:${each.row.assetId}` === activeKey);
};

export { activeItemOf };
