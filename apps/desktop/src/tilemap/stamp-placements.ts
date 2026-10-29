/* @layer renderer-app @kind logic */
import type { Point, Tilemap } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';
import { flagsOfBits } from './flags-of-bits';
import { inBounds } from './in-bounds';
import type { Placement } from './tilemap.type';

const stampPlacements = (stamp: TileStamp, origin: Point, tilemap: Tilemap): Placement[] => {
  const placements: Placement[] = [];
  stamp.keys.forEach((key, at) => {
    const cell = { x: origin.x + (at % stamp.columns), y: origin.y + Math.floor(at / stamp.columns) };
    if (key === 0 || !inBounds(tilemap, cell)) return;
    const bits = stamp.bits?.[at];
    placements.push(bits === undefined ? { key, cell } : { key, cell, flags: flagsOfBits(bits) });
  });
  return placements;
};

export { stampPlacements };
