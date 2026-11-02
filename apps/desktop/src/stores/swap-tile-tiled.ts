/* @layer renderer-app @kind logic */
import { MEMORY } from './swap-tile-tiled.constants';
import { useViewStore } from './useViewStore';

const swapTileTiled = (previous: string | null, next: string | null): void => {
  const view = useViewStore.getState();
  if (previous !== null) MEMORY.set(previous, view.tiled);
  if (next !== null) view.setTiled(MEMORY.get(next) ?? 'both');
};

export { swapTileTiled };
