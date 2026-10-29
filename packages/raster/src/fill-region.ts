/* @layer core @kind logic */
import { CORNER_STEPS, SIDE_STEPS } from './fill.constants';
import type { RegionFill } from './fill-region.type';
import { foldPoint } from './fold-point';
import { maskAllows } from './mask-allows';

const classOf = (options: RegionFill, sample: Uint8Array, offset: number): number => {
  const value = sample[offset] ?? 0;
  return options.classes ? (options.classes[value] ?? value) : value;
};

const fillRegion = (options: RegionFill): Uint8Array => {
  const { target } = options;
  const { width, height } = target;
  const sample = options.sample ?? target.pixels;
  const region = new Uint8Array(width * height);
  const seed = foldPoint(options.seed, target, options.wrap);
  if (seed.x < 0 || seed.y < 0 || seed.x >= width || seed.y >= height) return region;
  const match = classOf(options, sample, seed.y * width + seed.x);
  const open = (x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < width && y < height && maskAllows(options.mask, x, y) && classOf(options, sample, y * width + x) === match;
  if (options.mode === 'global') {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (open(x, y)) region[y * width + x] = 1;
      }
    }
    return region;
  }
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

export { fillRegion };
