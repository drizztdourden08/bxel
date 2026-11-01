/* @layer renderer-app @kind logic */
import type { TreeMoveWish } from '../../../editor/tree-move-plan.type';
import type { LayerRowModel } from '../LayerStack.type';

const indentWish = (rows: readonly LayerRowModel[], id: string): TreeMoveWish | null => {
  const row = rows.find((each) => each.id === id);
  if (!row) return null;
  const siblings = rows.filter((each) => each.parentId === row.parentId);
  const above = siblings[siblings.findIndex((each) => each.id === id) - 1];
  if (above?.kind !== 'group') return null;
  return { keys: [id], parentKey: above.id, index: rows.filter((each) => each.parentId === above.id).length };
};

export { indentWish };
