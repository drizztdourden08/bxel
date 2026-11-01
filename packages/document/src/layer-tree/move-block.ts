/* @layer core @kind logic */
import { blockOf } from './block-of';
import { inferParent } from './infer-parent';
import { normalizeTree } from './normalize-tree';
import type { BlockMove, TreeItem } from './tree-item.type';

const moveBlock = <T extends TreeItem>(items: readonly T[], move: BlockMove<T>): T[] => {
  const block = blockOf(items, move.id);
  const moved = items.filter((item) => block.has(item.id));
  const rest = items.filter((item) => !block.has(item.id));
  const at = Math.max(0, Math.min(move.to, rest.length));
  const parentId = move.parentId === undefined ? inferParent(rest, at) : (move.parentId ?? undefined);
  const placed = moved.map((item) => (item.id === move.id ? move.reparent(item, parentId) : item));
  return normalizeTree([...rest.slice(0, at), ...placed, ...rest.slice(at)], (item) => move.reparent(item, undefined));
};

export { moveBlock };
