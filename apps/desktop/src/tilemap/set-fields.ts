/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TileField } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from './current-tileset';
import { TILE_LABEL } from './tilemap.constants';

interface FieldsPatch {
  fields?: readonly TileField[];
  collisionLayers?: readonly string[];
}

const setFields = (patch: FieldsPatch): boolean => {
  const tileset = currentTileset();
  if (!tileset) return false;
  const options = { tileset: tileset.id, ...patch };
  return runDocument(TILE_LABEL.fields, [{ name: COMMAND_NAME.tilesetFields, targets: null, options }]) !== null;
};

export { setFields };
