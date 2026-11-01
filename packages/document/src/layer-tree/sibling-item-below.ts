/* @layer core @kind logic */
import type { TreeItem } from './tree-item.type';

const siblingItemBelow = <T extends TreeItem>(items: readonly T[], index: number): T | undefined => {
  const item = items[index];
  if (!item) return undefined;
  for (let at = index - 1; at >= 0; at -= 1) {
    const below = items[at];
    if (below?.parentId === item.parentId) return below;
  }
  return undefined;
};

export { siblingItemBelow };
