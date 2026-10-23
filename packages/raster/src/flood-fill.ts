/* @layer core @kind logic */
import { fillContiguous } from './fill-contiguous';
import { fillGlobal } from './fill-global';
import type { FillOptions, FillPlan } from './fill.type';
import type { Rect } from './geometry.type';
import { maskAllows } from './mask-allows';

const seedAllowed = (options: FillOptions): boolean => {
  const { target, seed } = options;
  const inside = seed.x >= 0 && seed.y >= 0 && seed.x < target.width && seed.y < target.height;
  return inside && maskAllows(options.mask, seed.x, seed.y);
};

const buildPlan = (options: FillOptions): FillPlan | null => {
  const { target, seed } = options;
  const match = target.pixels[seed.y * target.width + seed.x] ?? 0;
  const index = options.index & 255;
  if (match === index) {
    return null;
  }
  return {
    target,
    mask: options.mask ?? null,
    match,
    index,
    seed,
    reach: options.connectivity === 8 ? 1 : 0,
  };
};

const floodFill = (options: FillOptions): Rect | null => {
  const plan = seedAllowed(options) ? buildPlan(options) : null;
  if (!plan) {
    return null;
  }
  return options.mode === 'global' ? fillGlobal(plan) : fillContiguous(plan);
};

export { floodFill };
