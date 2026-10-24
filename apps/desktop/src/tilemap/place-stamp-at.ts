/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { groupPlacements } from './group-placements';
import { paintSteps } from './paint-steps';
import { readiedMap } from './readied-map';
import { readyStamp } from './ready-stamp';
import { runMap } from './run-map';
import { stampPlacements } from './stamp-placements';
import { TILE_LABEL } from './tilemap.constants';

const placeStampAt = (origins: readonly Point[]): boolean => {
  const target = readiedMap();
  const stamp = target ? readyStamp(target) : null;
  if (!target || !stamp) return false;
  const placements = origins.flatMap((origin) => stampPlacements(stamp, origin, target.tilemap));
  const groups = groupPlacements(placements, useTilemapStore.getState().flags);
  return runMap(TILE_LABEL.place, paintSteps(target, groups));
};

export { placeStampAt };
