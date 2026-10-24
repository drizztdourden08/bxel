/* @layer renderer-app @kind logic */
import type { Point, Tilemap } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';
import { inBounds } from './in-bounds';
import type { Placement } from './tilemap.type';

const stampPlacements = (stamp: TileStamp, origin: Point, tilemap: Tilemap): Placement[] => {
  const placements: Placement[] = [];
  stamp.keys.forEach((key, at) => {
    const cell = { x: origin.x + (at % stamp.columns), y: origin.y + Math.floor(at / stamp.columns) };
    if (key !== 0 && inBounds(tilemap, cell)) placements.push({ key, cell });
  });
  return placements;
};

export { stampPlacements };
