/* @layer core @kind logic */
import { isGroupItem } from './is-group-item';
import type { TreeItem } from './tree-item.type';

const ancestorsOf = <T extends TreeItem>(items: readonly T[], item: T): T[] => {
  const byId = new Map(items.map((each) => [each.id, each]));
  const chain: T[] = [];
  const seen = new Set<string>([item.id]);
  let parentId = item.parentId;
  while (parentId !== undefined && !seen.has(parentId)) {
    const parent = byId.get(parentId);
    if (!parent || !isGroupItem(parent)) break;
    chain.push(parent);
    seen.add(parentId);
    parentId = parent.parentId;
  }
  return chain;
};

export { ancestorsOf };
