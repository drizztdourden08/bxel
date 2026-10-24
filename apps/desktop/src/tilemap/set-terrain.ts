/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TerrainRules } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from './current-tileset';
import { TILE_LABEL } from './tilemap.constants';

const setTerrain = (rules: TerrainRules | null): boolean => {
  const tileset = currentTileset();
  if (!tileset) return false;
  return runDocument(TILE_LABEL.terrain, [{ name: COMMAND_NAME.tilesetTerrain, targets: null, options: { tileset: tileset.id, rules } }]) !== null;
};

export { setTerrain };
