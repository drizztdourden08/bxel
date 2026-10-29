/* @layer core @kind logic */
import type { Point } from '../geometry.type';
import { pixelPerfect } from '../pixel-perfect';
import { strokePoints } from '../stroke-points';
import { SAMPLES_PER_PIXEL } from './path.constants';

const quadratic = (first: number, control: number, last: number, t: number): number =>
  Math.round((1 - t) * (1 - t) * first + 2 * (1 - t) * t * control + t * t * last);

const cubic = (values: readonly [number, number, number, number], t: number): number => {
  const [first, one, two, last] = values;
  const back = 1 - t;
  return Math.round(back * back * back * first + 3 * back * back * t * one + 3 * back * t * t * two + t * t * t * last);
};

const reachOf = (points: readonly Point[]): number =>
  points.slice(1).reduce((sum, point, at) => sum + Math.hypot(point.x - (points[at]?.x ?? 0), point.y - (points[at]?.y ?? 0)), 0);

const sampleAt = (points: readonly Point[], t: number): Point | null => {
  const [start, one, two, end] = points;
  if (points.length === 4 && start && one && two && end) {
    return { x: cubic([start.x, one.x, two.x, end.x], t), y: cubic([start.y, one.y, two.y, end.y], t) };
  }
  if (!start || !one || !two) return null;
  return { x: quadratic(start.x, one.x, two.x, t), y: quadratic(start.y, one.y, two.y, t) };
};

/** A quadratic curve takes three points, a cubic curve four: the ends, then the bend handles. */
const curvePoints = (points: readonly Point[], perfect = true): Point[] => {
  if (points.length < 3 || sampleAt(points, 0) === null) return [];
  const steps = Math.max(1, Math.ceil(reachOf(points) * SAMPLES_PER_PIXEL));
  const samples: Point[] = [];
  for (let step = 0; step <= steps; step++) {
    const sample = sampleAt(points, step / steps);
    if (sample) samples.push(sample);
  }
  return perfect ? pixelPerfect(strokePoints(samples)) : strokePoints(samples);
};

export { curvePoints };
