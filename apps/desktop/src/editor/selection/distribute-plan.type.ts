/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';
import type { MaskIsland } from './mask-islands.type';

interface IslandMove {
  island: MaskIsland;
  offset: Point;
}

export type { IslandMove };
