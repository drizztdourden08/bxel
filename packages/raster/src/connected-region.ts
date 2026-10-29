/* @layer core @kind logic */
import { CORNER_STEPS, SIDE_STEPS } from './fill.constants';
import type { RegionFill } from './fill-region.type';
import { foldPoint } from './fold-point';
import type { Point } from './geometry.type';

const connectedRegion = (options: RegionFill, seed: Point, open: (x: number, y: number) => boolean): Uint8Array => {
  const { target } = options;
  const { width, height } = target;
  const region = new Uint8Array(width * height);
  const steps = options.connectivity === 8 ? [...SIDE_STEPS, ...CORNER_STEPS] : SIDE_STEPS;
  const stack: number[] = [];
  if (open(seed.x, seed.y)) {
    region[seed.y * width + seed.x] = 1;
    stack.push(seed.x, seed.y);
  }
  for (let y = stack.pop(); y !== undefined; y = stack.pop()) {
    const x = stack.pop() ?? 0;
    for (const [dx, dy] of steps) {
      const next = foldPoint({ x: x + dx, y: y + dy }, target, options.wrap);
      if (open(next.x, next.y) && region[next.y * width + next.x] === 0) {
        region[next.y * width + next.x] = 1;
        stack.push(next.x, next.y);
      }
    }
  }
  return region;
};

export { connectedRegion };
