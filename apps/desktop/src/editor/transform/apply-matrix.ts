/* @layer renderer-app @kind logic */
import type { Matrix2, Point } from '@bxel/raster';

const applyMatrix = (m: Matrix2, point: Point): Point => ({ x: m[0] * point.x + m[1] * point.y, y: m[2] * point.x + m[3] * point.y });

export { applyMatrix };
