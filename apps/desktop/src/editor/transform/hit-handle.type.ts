/* @layer renderer-app @kind types */
import type { Point, Quad } from '@bxel/raster';

interface HitRequest {
  quad: Quad;
  pivot: Point;
  point: Point;
  zoom: number;
}

export type { HitRequest };
