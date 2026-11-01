/* @layer renderer-app @kind logic */
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

export { blockIds };
