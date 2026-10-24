/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TileCollision } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from './current-tileset';
import { TILE_LABEL } from './tilemap.constants';

const setCollision = (key: number, shape: TileCollision | null): boolean => {
  const tileset = currentTileset();
  if (!tileset) return false;
  const options = { tileset: tileset.id, key, shape: shape ?? { kind: 'none' } };
  return runDocument(TILE_LABEL.collision, [{ name: COMMAND_NAME.tileCollision, targets: null, options }]) !== null;
};

export { setCollision };
