/* @layer core @kind logic */
import { normalizeTree } from './normalize-tree';
import { reparentItem } from './reparent-item';
import type { TreeItem } from './tree-item.type';

const groupItems = <T extends TreeItem>(items: readonly T[], members: ReadonlySet<string>, group: T): T[] => {
  const top = Math.max(...items.flatMap((item, at) => (members.has(item.id) ? [at] : [])));
  const placed = items.map((item) => (members.has(item.id) ? reparentItem(item, group.id) : item));
  return normalizeTree([...placed.slice(0, top + 1), group, ...placed.slice(top + 1)], (item) => reparentItem(item, undefined));
};

export { groupItems };
