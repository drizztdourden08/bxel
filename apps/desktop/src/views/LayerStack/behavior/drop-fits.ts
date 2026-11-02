/* @layer renderer-app @kind logic */
import { MAX_LAYER_DEPTH } from '@bxel/document';
import type { LayerRowModel } from '../LayerStack.type';

const heightOf = (rows: readonly LayerRowModel[], id: string, seen: ReadonlySet<string> = new Set()): number => {
  const kids = rows.filter((row) => row.parentId === id && !seen.has(row.id));
  if (kids.length === 0) return 0;
  return 1 + Math.max(...kids.map((kid) => heightOf(rows, kid.id, new Set([...seen, id]))));
};

const dropFits = (rows: readonly LayerRowModel[], move: { keys: readonly string[]; parentKey: string | null }): boolean => {
  const parent = move.parentKey === null ? undefined : rows.find((row) => row.id === move.parentKey);
  const level = parent ? parent.depth + 2 : 1;
  return move.keys.every((key) => level + heightOf(rows, key) <= MAX_LAYER_DEPTH + 1);
};

export { dropFits };
