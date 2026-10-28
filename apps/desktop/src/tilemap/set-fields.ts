/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from './current-tileset';
import type { FieldsPatch } from './set-fields.type';
import { TILE_LABEL } from './tilemap.constants';

const setFields = (patch: FieldsPatch): boolean => {
  const tileset = currentTileset();
  if (!tileset) return false;
  const options = { tileset: tileset.id, ...patch };
  return runDocument(TILE_LABEL.fields, [{ name: COMMAND_NAME.tilesetFields, targets: null, options }]) !== null;
};

export { setFields };
