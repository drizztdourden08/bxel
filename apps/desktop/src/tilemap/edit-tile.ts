/* @layer renderer-app @kind logic */
import { findTile } from '@bxel/document';
import { switchMode } from '../sheet/switch-mode';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentTileset } from './current-tileset';
import { TILEMAP_TEXT } from './tilemap.constants';

const editTile = (wanted?: number): boolean => {
  const tileset = currentTileset();
  const store = useTilemapStore.getState();
  const key = wanted ?? store.stamp.keys.find((each) => each !== 0) ?? tileset?.tiles[0]?.key;
  const tile = tileset && key !== undefined ? findTile(tileset, key) : undefined;
  if (!tile) {
    useNoticeStore.getState().post(tileset ? TILEMAP_TEXT.needFirstTile : TILEMAP_TEXT.noTileset);
    return false;
  }
  if (!switchMode('tilemap')) return false;
  store.setStamp({ columns: 1, rows: 1, keys: [tile.key] });
  store.editTile(tile.key, tile.spriteId);
  return true;
};

export { editTile };
