/* @layer renderer-app @kind logic */
import { blockOf, moveBlock, reparentItem } from '@bxel/document';
import type { TreeMoveItem, TreeMoveStep, TreeMoveWish } from './tree-move-plan.type';

const childrenTopFirst = (items: readonly TreeMoveItem[], parentKey: string | null): string[] =>
  items.filter((item) => (item.parentId ?? null) === parentKey).map((item) => item.id).reverse();

const placeOf = (rest: readonly TreeMoveItem[], below: string | undefined, parentKey: string | null): number => {
  if (below !== undefined) return rest.findIndex((item) => item.id === below) + 1;
  if (parentKey === null) return 0;
  const block = blockOf(rest, parentKey);
  return Math.max(0, rest.findIndex((item) => block.has(item.id)));
};

const treeMovePlan = (items: readonly TreeMoveItem[], wish: TreeMoveWish): TreeMoveStep[] => {
  const keys = new Set(wish.keys);
  const moved = [...items].reverse().filter((item) => keys.has(item.id)).map((item) => item.id);
  const staying = childrenTopFirst(items, wish.parentKey).filter((id) => !keys.has(id));
  const order = [...staying.slice(0, wish.index), ...moved, ...staying.slice(wish.index)].reverse();
  const steps: TreeMoveStep[] = [];
  let now: readonly TreeMoveItem[] = items;
  order.forEach((id, at) => {
    if (!keys.has(id)) return;
    const block = blockOf(now, id);
    const rest = now.filter((item) => !block.has(item.id));
    const to = placeOf(rest, order[at - 1], wish.parentKey);
    steps.push({ id, to, parentId: wish.parentKey });
    now = moveBlock(now, { id, to, parentId: wish.parentKey, reparent: reparentItem });
  });
  return steps;
};

export { treeMovePlan };
