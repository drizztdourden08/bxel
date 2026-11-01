/* @layer renderer-app @kind logic */
import type { TreeMoveWish } from '../../../editor/tree-move-plan.type';
import type { LayerRowModel } from '../LayerStack.type';

const insideOf = (byId: ReadonlyMap<string, LayerRowModel>, row: LayerRowModel, id: string): boolean => {
  const seen = new Set<string>();
  let parent = row.parentId;
  while (parent !== null && !seen.has(parent)) {
    if (parent === id) return true;
    seen.add(parent);
    parent = byId.get(parent)?.parentId ?? null;
  }
  return false;
};

const blockIds = (rows: readonly LayerRowModel[], id: string): Set<string> => {
  const byId = new Map(rows.map((row) => [row.id, row]));
  return new Set(rows.filter((row) => row.id === id || insideOf(byId, row, id)).map((row) => row.id));
};

const dropWish = (shown: readonly LayerRowModel[], from: number, to: number): TreeMoveWish | null => {
  const moved = shown[from];
  if (!moved) return null;
  const block = blockIds(shown, moved.id);
  const rest = shown.filter((row) => !block.has(row.id));
  const at = Math.max(0, Math.min(to, rest.length));
  const parentKey = rest[at]?.parentId ?? null;
  const index = rest.slice(0, at).filter((row) => row.parentId === parentKey).length;
  return { keys: [moved.id], parentKey, index };
};

const outdentWish = (rows: readonly LayerRowModel[], id: string): TreeMoveWish | null => {
  const row = rows.find((each) => each.id === id);
  const parent = rows.find((each) => each.id === row?.parentId);
  if (!row || !parent) return null;
  const siblings = rows.filter((each) => each.parentId === parent.parentId);
  return { keys: [id], parentKey: parent.parentId, index: siblings.findIndex((each) => each.id === parent.id) };
};

const indentWish = (rows: readonly LayerRowModel[], id: string): TreeMoveWish | null => {
  const row = rows.find((each) => each.id === id);
  if (!row) return null;
  const siblings = rows.filter((each) => each.parentId === row.parentId);
  const above = siblings[siblings.findIndex((each) => each.id === id) - 1];
  if (!above || above.kind !== 'group') return null;
  return { keys: [id], parentKey: above.id, index: rows.filter((each) => each.parentId === above.id).length };
};

export { blockIds, dropWish, indentWish, outdentWish };
