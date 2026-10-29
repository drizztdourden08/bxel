/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { groupPlacements } from './group-placements';
import { paintSteps } from './paint-steps';
import { readiedMap } from './readied-map';
import { runMap } from './run-map';
import { scatterPlacements } from './scatter-placements';
import { TILE_LABEL, TILEMAP_TEXT } from './tilemap.constants';
import { usableStamp } from './usable-stamp';

const scatterAt = (cells: readonly Point[]): boolean => {
  const target = readiedMap();
  if (!target) return false;
  const { stamp, flags } = useTilemapStore.getState();
  const placements = scatterPlacements(usableStamp(stamp, target.tileset), cells, target);
  if (placements.length === 0) {
    useNoticeStore.getState().post(TILEMAP_TEXT.noScatter);
    return false;
  }
  return runMap(TILE_LABEL.place, paintSteps(target, groupPlacements(placements, flags)));
};

export { scatterAt };
