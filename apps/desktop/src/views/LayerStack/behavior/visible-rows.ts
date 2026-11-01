/* @layer renderer-app @kind logic */
import type { LayerRowModel } from '../LayerStack.type';

const visibleRows = (rows: readonly LayerRowModel[], folded: readonly string[]): readonly LayerRowModel[] => {
  if (folded.length === 0) return rows;
  const byId = new Map(rows.map((row) => [row.id, row]));
  const hidden = (row: LayerRowModel): boolean => {
    const seen = new Set<string>();
    let parent = row.parentId;
    while (parent !== null && !seen.has(parent)) {
      if (folded.includes(parent)) return true;
      seen.add(parent);
      parent = byId.get(parent)?.parentId ?? null;
    }
    return false;
  };
  return rows.filter((row) => !hidden(row));
};

export { visibleRows };
