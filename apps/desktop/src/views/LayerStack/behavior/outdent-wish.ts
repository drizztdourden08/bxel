/* @layer renderer-app @kind logic */
import type { TreeMoveWish } from '../../../editor/tree-move-plan.type';
import type { LayerRowModel } from '../LayerStack.type';

const outdentWish = (rows: readonly LayerRowModel[], id: string): TreeMoveWish | null => {
  const row = rows.find((each) => each.id === id);
  const parent = rows.find((each) => each.id === row?.parentId);
  if (!row || !parent) return null;
  const siblings = rows.filter((each) => each.parentId === parent.parentId);
  return { keys: [id], parentKey: parent.parentId, index: siblings.findIndex((each) => each.id === parent.id) };
};

export { outdentWish };
