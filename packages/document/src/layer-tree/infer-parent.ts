/* @layer core @kind logic */
import { ancestorsOf } from './ancestors-of';
import { isGroupItem } from './is-group-item';
import type { TreeItem } from './tree-item.type';

const inferParent = <T extends TreeItem>(rest: readonly T[], at: number): string | undefined => {
  const above = rest[at];
  const below = rest[at - 1];
  if (!above) return undefined;
  if (isGroupItem(above) && below && ancestorsOf(rest, below).some((parent) => parent.id === above.id)) return above.id;
  return above.parentId;
};

export { inferParent };
