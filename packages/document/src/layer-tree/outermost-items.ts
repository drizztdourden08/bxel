/* @layer core @kind logic */
import { ancestorsOf } from './ancestors-of';
import type { TreeItem } from './tree-item.type';

const outermostItems = <T extends TreeItem>(items: readonly T[], picked: readonly T[]): T[] => {
  const ids = new Set(picked.map((item) => item.id));
  return picked.filter((item, at) => picked.findIndex((each) => each.id === item.id) === at && !ancestorsOf(items, item).some((parent) => ids.has(parent.id)));
};

export { outermostItems };
