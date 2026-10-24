/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Rect } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { groupPlacements } from './group-placements';
import { layerOptions } from './layer-options';
import { paintSteps } from './paint-steps';
import { patternPlacements } from './pattern-placements';
import { readiedMap } from './readied-map';
import { readyStamp } from './ready-stamp';
import { rectCells } from './rect-cells';
import { runMap } from './run-map';
import { terrainActive } from './terrain/terrain-active';
import { terrainCells } from './terrain/terrain-cells';
import { TILE_LABEL } from './tilemap.constants';

const rectPlace = (rect: Rect): boolean => {
  const target = readiedMap();
  if (target && terrainActive(target)) return terrainCells(target, rectCells(rect, useTilemapStore.getState().filled), false);
  const stamp = target ? readyStamp(target) : null;
  if (!target || !stamp) return false;
  const { flags, filled } = useTilemapStore.getState();
  if (stamp.keys.length > 1) {
    const groups = groupPlacements(patternPlacements(stamp, rect, filled, target.tilemap), flags);
    return runMap(TILE_LABEL.rect, paintSteps(target, groups));
  }
  const options = { ...layerOptions(target), rect, tile: stamp.keys[0], flags, filled };
  return runMap(TILE_LABEL.rect, [{ name: COMMAND_NAME.mapRect, targets: null, options }]);
};

export { rectPlace };
