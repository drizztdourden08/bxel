/* @layer renderer-app @kind logic */
import { terrainSetsOf } from '@bxel/document';
import { currentMap } from '../current-map';
import { TERRAIN_TEXT } from './terrain.constants';

const terrainMissing = (): string | undefined => {
  const target = currentMap();
  if (!target) return undefined;
  return terrainSetsOf(target.tileset).length === 0 ? TERRAIN_TEXT.noRules : undefined;
};

export { terrainMissing };
