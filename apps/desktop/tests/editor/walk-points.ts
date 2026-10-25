/* @layer renderer-app @kind test */
import type { Point } from '@bxel/raster';

const GROWTH = 1103515245;
const OFFSET = 12345;
const RANGE = 2147483648;

const walkPoints = (seed: number, count: number, side: number): Point[] => {
  let state = seed;
  const roll = (limit: number): number => {
    state = (state * GROWTH + OFFSET) % RANGE;
    return Math.floor((state / RANGE) * limit);
  };
  const clamp = (value: number): number => Math.min(side - 1, Math.max(0, value));
  const walk: Point[] = [{ x: roll(side), y: roll(side) }];
  while (walk.length < count) {
    const from = walk[walk.length - 1] ?? { x: 0, y: 0 };
    const far = roll(10) === 0;
    walk.push(far ? { x: roll(side), y: roll(side) } : { x: clamp(from.x + roll(5) - 2), y: clamp(from.y + roll(5) - 2) });
  }
  return walk;
};

export { walkPoints };
