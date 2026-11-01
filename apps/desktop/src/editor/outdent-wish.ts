/* @layer renderer-app @kind logic */
import type { OutdentItem } from './outdent-wish.type';
import type { TreeMoveWish } from './tree-move-plan.type';

const outdentWish = (topFirst: readonly OutdentItem[], id: string): TreeMoveWish | null => {
  const row = topFirst.find((each) => each.id === id);
  const parent = topFirst.find((each) => each.id === row?.parentId);
  if (!row || !parent) return null;
  const siblings = topFirst.filter((each) => (each.parentId ?? null) === (parent.parentId ?? null));
  return { keys: [id], parentKey: parent.parentId ?? null, index: siblings.findIndex((each) => each.id === parent.id) };
};

export { outdentWish };
