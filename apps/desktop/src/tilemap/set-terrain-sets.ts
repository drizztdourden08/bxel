/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TerrainSet } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from './current-tileset';
import { TILE_LABEL } from './tilemap.constants';

const setTerrainSets = (sets: readonly TerrainSet[] | null, label: string = TILE_LABEL.terrain): boolean => {
  const tileset = currentTileset();
  if (!tileset) return false;
  return runDocument(label, [{ name: COMMAND_NAME.tilesetTerrainSets, targets: null, options: { tileset: tileset.id, sets } }]) !== null;
};

export { setTerrainSets };
