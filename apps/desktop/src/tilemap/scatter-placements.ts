/* @layer renderer-app @kind logic */
import type { Point, Tilemap, Tileset } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';
import { inBounds } from './in-bounds';
import { scatterKey } from './scatter-key';
import type { Placement } from './tilemap.type';

const scatterPlacements = (stamp: TileStamp, cells: readonly Point[], target: { tilemap: Tilemap; tileset: Tileset }): Placement[] =>
  cells.flatMap((cell) => {
    const key = scatterKey(stamp, target.tileset, Math.random());
    return key !== 0 && inBounds(target.tilemap, cell) ? [{ key, cell }] : [];
  });

export { scatterPlacements };
