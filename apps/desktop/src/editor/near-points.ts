/* @layer renderer-app @kind logic */
import type { PerfectTrail, Point } from '@bxel/raster';

const touches = (point: Point, gone: readonly Point[], span: number): boolean =>
  gone.some((other) => Math.abs(point.x - other.x) < span && Math.abs(point.y - other.y) < span);

const nearPoints = (trails: readonly PerfectTrail[], gone: readonly Point[], span: number): Point[] =>
  trails.flatMap((trail) => trail.kept.filter((point) => touches(point, gone, span)));

export { nearPoints };
