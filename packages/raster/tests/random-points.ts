/* @layer tests @kind helper */
import type { Point } from '@bxel/raster';

const MULTIPLIER = 1664525;
const INCREMENT = 1013904223;
const MODULUS = 4294967296;

const randomPoints = (seed: number, count: number, side: number): Point[] => {
  let state = seed;
  const next = (limit: number): number => {
    state = (state * MULTIPLIER + INCREMENT) % MODULUS;
    return Math.floor((state / MODULUS) * limit);
  };
  const points: Point[] = [];
  let x = next(side);
  let y = next(side);
  for (let step = 0; step < count; step += 1) {
    const jump = next(12) === 0;
    x = jump ? next(side) : Math.min(side - 1, Math.max(0, x + next(5) - 2));
    y = jump ? next(side) : Math.min(side - 1, Math.max(0, y + next(5) - 2));
    points.push({ x, y });
  }
  return points;
};

export { randomPoints };
