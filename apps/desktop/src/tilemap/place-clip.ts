/* @layer renderer-app @kind logic */
import { NO_FLAGS } from '@bxel/document';
import type { Point } from '@bxel/document';
import type { CellClip } from '../stores/tilemap-store.type';
import { currentMap } from './current-map';
import { groupPlacements } from './group-placements';
import { paintSteps } from './paint-steps';
import { readiedMap } from './readied-map';
import { runMap } from './run-map';
import { selectionOfMask } from './selection-of-mask';
import { stampPlacements } from './stamp-placements';
import { TILE_LABEL } from './tilemap.constants';
import { usableStamp } from './usable-stamp';
import { commitMapSelection } from './commit-map-selection';

const placeClip = (clip: CellClip, origin: Point): boolean => {
  const target = readiedMap();
  if (!target) return false;
  const placements = stampPlacements(usableStamp(clip.stamp, target.tileset), origin, target.tilemap);
  if (placements.length === 0) return false;
  const placed = new Uint8Array(target.tilemap.columns * target.tilemap.rows);
  for (const { cell } of placements) placed[cell.y * target.tilemap.columns + cell.x] = 1;
  if (!runMap(TILE_LABEL.paste, paintSteps(target, groupPlacements(placements, NO_FLAGS)))) return false;
  const after = currentMap();
  commitMapSelection(after ? selectionOfMask(placed, after) : null);
  return true;
};

export { placeClip };
