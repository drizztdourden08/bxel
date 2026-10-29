/* @layer renderer-app @kind logic */
import { COMMAND_NAME, terrainSetsOf } from '@bxel/document';
import type { Point } from '@bxel/document';
import { useTilesetViewStore } from '../../stores/useTilesetViewStore';
import { layerOptions } from '../layer-options';
import { runMap } from '../run-map';
import { TILE_LABEL } from '../tilemap.constants';
import type { MapTarget } from '../tilemap.type';
import { chosenSet } from './chosen-set';

const terrainCells = (target: MapTarget, cells: readonly Point[], erase: boolean): boolean => {
  const set = chosenSet(terrainSetsOf(target.tileset), useTilesetViewStore.getState().terrainSetId);
  return runMap(erase ? TILE_LABEL.terrainErase : TILE_LABEL.terrainPaint, [
    { name: COMMAND_NAME.mapTerrain, targets: null, options: { ...layerOptions(target), cells, mode: erase ? 'erase' : 'paint', ...(set ? { set: set.id } : {}) } },
  ]);
};

export { terrainCells };
