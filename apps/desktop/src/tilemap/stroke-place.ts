/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { layerOptions } from './layer-options';
import { placeStampAt } from './place-stamp-at';
import { readiedMap } from './readied-map';
import { readyStamp } from './ready-stamp';
import { runMap } from './run-map';
import { terrainActive } from './terrain/terrain-active';
import { terrainCells } from './terrain/terrain-cells';
import { TILE_LABEL } from './tilemap.constants';

const strokePlace = (points: readonly Point[]): boolean => {
  const target = readiedMap();
  if (target && terrainActive(target)) return terrainCells(target, points, false);
  const stamp = target ? readyStamp(target) : null;
  if (!target || !stamp) return false;
  if (stamp.keys.length > 1) return placeStampAt(points);
  const options = { ...layerOptions(target), points, tile: stamp.keys[0], flags: useTilemapStore.getState().flags };
  return runMap(TILE_LABEL.place, [{ name: COMMAND_NAME.mapPaint, targets: null, options }]);
};

export { strokePlace };
