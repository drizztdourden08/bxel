/* @layer core @kind logic */
import { listOf } from './list-of';
import { numberOf } from './number-of';
import { recOf } from './rec-of';
import type { Rec } from './rec.type';
import { TILED_LIMITS } from './tiled.constants';
import type { TiledPoint, TiledShape } from './tiled.type';

const readPoints = (value: unknown, originX: number, originY: number): TiledPoint[] =>
  listOf(value)
    .slice(0, TILED_LIMITS.MAX_POINTS)
    .map((entry) => {
      const point = recOf(entry);
      return { x: originX + numberOf(point['x'], 0), y: originY + numberOf(point['y'], 0) };
    });

const readShape = (object: Rec): TiledShape | null => {
  if (object['point'] === true || object['ellipse'] === true) return null;
  const x = numberOf(object['x'], 0);
  const y = numberOf(object['y'], 0);
  if (Array.isArray(object['polygon'])) {
    const points = readPoints(object['polygon'], x, y);
    return points.length >= 3 ? { kind: 'polygon', points } : null;
  }
  if (Array.isArray(object['polyline'])) return null;
  const width = numberOf(object['width'], 0);
  const height = numberOf(object['height'], 0);
  return width > 0 && height > 0 ? { kind: 'rect', x, y, width, height } : null;
};

const readShapes = (group: unknown): TiledShape[] =>
  listOf(recOf(group)['objects']).flatMap((entry) => readShape(recOf(entry)) ?? []);

export { readShapes };
