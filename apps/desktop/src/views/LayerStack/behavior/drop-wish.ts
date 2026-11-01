/* @layer renderer-app @kind logic */
import type { TreeMoveWish } from '../../../editor/tree-move-plan.type';
import type { LayerRowModel } from '../LayerStack.type';
import { blockIds } from './block-ids';

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

export { dropWish };
