/* @layer core @kind logic */
import type { Point } from '../geometry.type';
import { pixelPerfect } from '../pixel-perfect';
import { strokePoints } from '../stroke-points';
import { SAMPLES_PER_PIXEL } from './path.constants';

const along = (first: number, control: number, last: number, t: number): number =>
  Math.round((1 - t) * (1 - t) * first + 2 * (1 - t) * t * control + t * t * last);

const curvePoints = (points: readonly Point[]): Point[] => {
  const [start, control, end] = points;
  if (!start || !control || !end) {
    return [];
  }
  const reach = Math.hypot(control.x - start.x, control.y - start.y) + Math.hypot(end.x - control.x, end.y - control.y);
  const steps = Math.max(1, Math.ceil(reach * SAMPLES_PER_PIXEL));
  const samples: Point[] = [];
  for (let step = 0; step <= steps; step++) {
    const t = step / steps;
    samples.push({ x: along(start.x, control.x, end.x, t), y: along(start.y, control.y, end.y, t) });
  }
  return pixelPerfect(strokePoints(samples));
};

export { curvePoints };
