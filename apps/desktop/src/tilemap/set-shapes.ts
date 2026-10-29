/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TileShape } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from './current-tileset';
import type { ShapeMode } from './set-shapes.type';
import { TILE_LABEL } from './tilemap.constants';

const setShapes = (keys: readonly number[], shapes: readonly TileShape[], mode: ShapeMode = 'set'): boolean => {
  const tileset = currentTileset();
  if (!tileset || keys.length === 0) return false;
  const options = { tileset: tileset.id, keys, shapes, mode };
  return runDocument(TILE_LABEL.collision, [{ name: COMMAND_NAME.tileShapes, targets: null, options }]) !== null;
};

export { setShapes };
