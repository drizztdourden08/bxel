/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Point } from '@bxel/document';
import { layerOptions } from '../layer-options';
import { runMap } from '../run-map';
import { TILE_LABEL } from '../tilemap.constants';
import type { MapTarget } from '../tilemap.type';

const terrainCells = (target: MapTarget, cells: readonly Point[], erase: boolean): boolean =>
  runMap(erase ? TILE_LABEL.terrainErase : TILE_LABEL.terrainPaint, [
    { name: COMMAND_NAME.mapTerrain, targets: null, options: { ...layerOptions(target), cells, mode: erase ? 'erase' : 'paint' } },
  ]);

export { terrainCells };
