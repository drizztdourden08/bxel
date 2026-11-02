/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentTileset } from './current-tileset';
import { selectedKeys } from './selected-keys';
import { TILE_LABEL } from './tilemap.constants';

const deleteSelectedTiles = (keys?: readonly number[]): boolean => {
  const tileset = currentTileset();
  const targets = keys ?? selectedKeys();
  if (!tileset || targets.length === 0) return false;
  const steps = targets.map((key) => ({ name: COMMAND_NAME.tileDelete, targets: null, options: { tileset: tileset.id, key, replacement: 0 } }));
  const done = runDocument(TILE_LABEL.deleteTile, steps);
  const { editKey, placeTiles } = useTilemapStore.getState();
  if (done && editKey !== null && targets.includes(editKey)) placeTiles();
  return done !== null;
};

export { deleteSelectedTiles };
