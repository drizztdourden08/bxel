/* @layer core @kind logic */
import type { Point, Rect } from '../geometry.type';
import { ROUNDING_SCALE } from './region.constants';

const clean = (value: number): number => Math.round(value * ROUNDING_SCALE) / ROUNDING_SCALE;

const pointsArea = (points: readonly Point[]): Rect => {
  const xs = points.map((point) => clean(point.x));
  const ys = points.map((point) => clean(point.y));
  const left = Math.floor(Math.min(...xs));
  const top = Math.floor(Math.min(...ys));
  return { x: left, y: top, width: Math.ceil(Math.max(...xs)) - left, height: Math.ceil(Math.max(...ys)) - top };
};

export { pointsArea };
