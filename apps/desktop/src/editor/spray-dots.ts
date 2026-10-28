/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { SprayDots } from './spray-dots.type';
import { nextRandom } from './spray-random';

const sprayDots = (at: Point, size: number, count: number, seed: number): SprayDots => {
  const dots: Point[] = [];
  let state = seed;
  const radius = size / 2;
  for (let each = 0; each < count; each++) {
    const angle = nextRandom(state);
    const reach = nextRandom(angle.state);
    state = reach.state;
    const distance = Math.sqrt(reach.value) * radius;
    dots.push({ x: Math.round(at.x + Math.cos(angle.value * 2 * Math.PI) * distance), y: Math.round(at.y + Math.sin(angle.value * 2 * Math.PI) * distance) });
  }
  return { dots, state };
};

export { sprayDots };
