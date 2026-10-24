/* @layer renderer-app @kind logic */
import { findTile } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentTileset } from './current-tileset';

const pickTile = (key: number): boolean => {
  const tileset = currentTileset();
  const tile = tileset ? findTile(tileset, key) : undefined;
  if (!tile) return false;
  const store = useTilemapStore.getState();
  store.setStamp({ columns: 1, rows: 1, keys: [key] });
  if (store.editMode === 'edit') store.editTile(key, tile.spriteId);
  return true;
};

export { pickTile };
