/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { POINT_LIMIT } from './stroke.constants';

const within = (value: number): number => Math.max(-POINT_LIMIT, Math.min(POINT_LIMIT, value));

const clampPoint = (at: Point): Point => ({ x: within(at.x), y: within(at.y) });

export { clampPoint };
