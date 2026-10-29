/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';

const samePoint = (first: Point, second: Point): boolean => first.x === second.x && first.y === second.y;

export { samePoint };
