/* @layer renderer-app @kind logic */
import { terrainSetsOf } from '@bxel/document';
import { currentTileset } from '../current-tileset';
import { setTerrainSets } from '../set-terrain-sets';
import { activeSet } from './active-set';
import { fillByTurning } from './fill-by-turning';
import { TERRAIN_TEXT } from './terrain.constants';

const runFillTurning = (set?: string): boolean => {
  const tileset = currentTileset();
  const target = activeSet(set);
  if (!tileset || !target) return false;
  const next = fillByTurning(target, tileset);
  return setTerrainSets(terrainSetsOf(tileset).map((each) => (each.id === target.id ? next : each)), TERRAIN_TEXT.fillTurning);
};

export { runFillTurning };
