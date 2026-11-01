/* @layer core @kind logic */
import { normalizeTree } from './normalize-tree';
import { reparentItem } from './reparent-item';
import type { TreeItem } from './tree-item.type';

const ungroupItems = <T extends TreeItem>(items: readonly T[], group: T): T[] =>
  normalizeTree(
    items.filter((item) => item.id !== group.id).map((item) => (item.parentId === group.id ? reparentItem(item, group.parentId) : item)),
    (item) => reparentItem(item, undefined),
  );

export { ungroupItems };
