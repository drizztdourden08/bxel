/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentTileset } from './current-tileset';
import { TILE_LABEL } from './tilemap.constants';

const deleteTile = (key: number, replacement: number | undefined): boolean => {
  const tileset = currentTileset();
  if (!tileset) return false;
  const options = { tileset: tileset.id, key, ...(replacement === undefined ? {} : { replacement }) };
  const done = runDocument(TILE_LABEL.deleteTile, [{ name: COMMAND_NAME.tileDelete, targets: null, options }]);
  if (done && useTilemapStore.getState().editKey === key) useTilemapStore.getState().placeTiles();
  return done !== null;
};

export { deleteTile };
