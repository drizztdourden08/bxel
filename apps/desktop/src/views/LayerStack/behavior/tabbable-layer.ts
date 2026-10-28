/* @layer renderer-app @kind logic */
import type { LayerRowModel } from '../LayerStack.type';

const tabbableLayer = (rows: readonly LayerRowModel[], focusedId: string | null, activeId: string | null): string | undefined => {
  const known = (id: string | null): id is string => id !== null && rows.some((row) => row.id === id);
  if (known(focusedId)) return focusedId;
  return known(activeId) ? activeId : rows[0]?.id;
};

export { tabbableLayer };
