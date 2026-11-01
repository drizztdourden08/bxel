/* @layer core @kind logic */
import { ancestorsOf } from './ancestors-of';
import type { TreeItem } from './tree-item.type';

const descendantIds = <T extends TreeItem>(items: readonly T[], groupId: string): Set<string> =>
  new Set(items.filter((item) => ancestorsOf(items, item).some((parent) => parent.id === groupId)).map((item) => item.id));

export { descendantIds };
