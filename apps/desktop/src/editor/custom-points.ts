/* @layer renderer-app @kind logic */
import { strokePoints } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import { POINT_LIMIT } from './stroke.constants';

const customPoints = (points: readonly Point[]): Point[] => strokePoints(points).slice(0, POINT_LIMIT);

export { customPoints };
