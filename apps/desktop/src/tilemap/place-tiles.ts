/* @layer renderer-app @kind logic */
import { switchMode } from '../sheet/switch-mode';
import { useTilemapStore } from '../stores/useTilemapStore';

const placeTiles = (): boolean => {
  if (!switchMode('tilemap')) return false;
  useTilemapStore.getState().placeTiles();
  return true;
};

export { placeTiles };
