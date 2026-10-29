/* @layer renderer-app @kind logic */
import { createItem } from './create-item';
import { isExpandable } from './is-expandable';
import type { BrowserItem, ItemTree } from './project-browser.type';
import type { CreateTarget, ViewTree } from './browser-state.type';

const treeNest = (tree: ItemTree, create: CreateTarget | null): ViewTree => {
  const made = create === null ? null : createItem(create, tree);
  const itemsOf = (keys: readonly string[]): BrowserItem[] => keys.flatMap((key) => tree.items.get(key) ?? []);
  const inside = tree.mainKey === null ? [] : (tree.children.get(tree.mainKey) ?? []);
  const top = [...itemsOf(inside), ...itemsOf((tree.children.get(null) ?? []).filter((key) => key !== tree.mainKey))];
  const childrenOf = (item: BrowserItem): readonly BrowserItem[] | undefined => {
    if (!isExpandable(item)) return undefined;
    const own = itemsOf(tree.children.get(item.key) ?? []);
    return made !== null && made.parentKey === item.key ? [made, ...own] : own;
  };
  return { top, childrenOf };
};

export { treeNest };
