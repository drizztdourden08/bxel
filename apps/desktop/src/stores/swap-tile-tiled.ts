/* @layer renderer-app @kind logic */
import { useViewStore } from './useViewStore';
import type { TileMode } from './view-store.type';

const MEMORY = new Map<string, TileMode>();

const swapTileTiled = (previous: string | null, next: string | null): void => {
  const view = useViewStore.getState();
  if (previous !== null) MEMORY.set(previous, view.tiled);
  if (next !== null) view.setTiled(MEMORY.get(next) ?? 'both');
};

export { swapTileTiled };
