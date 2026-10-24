/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Point } from '@bxel/document';
import { layerOptions } from './layer-options';
import { readiedMap } from './readied-map';
import { runMap } from './run-map';
import { terrainActive } from './terrain/terrain-active';
import { terrainCells } from './terrain/terrain-cells';
import { TILE_LABEL } from './tilemap.constants';

const strokeErase = (points: readonly Point[]): boolean => {
  const target = readiedMap();
  if (!target) return false;
  if (terrainActive(target)) return terrainCells(target, points, true);
  return runMap(TILE_LABEL.erase, [{ name: COMMAND_NAME.mapErase, targets: null, options: { ...layerOptions(target), points } }]);
};

export { strokeErase };
