/* @layer core @kind logic */
import { fillContiguous } from './fill-contiguous';
import { fillGlobal } from './fill-global';
import { fillWrapped } from './fill-wrapped';
import type { FillOptions, FillPlan } from './fill.type';
import { foldPoint } from './fold-point';
import type { Rect } from './geometry.type';
import { isWrapped } from './is-wrapped';
import { maskAllows } from './mask-allows';

const seedAllowed = (options: FillOptions, seed: FillPlan['seed']): boolean => {
  const { target } = options;
  const inside = seed.x >= 0 && seed.y >= 0 && seed.x < target.width && seed.y < target.height;
  return inside && maskAllows(options.mask, seed.x, seed.y);
};

const buildPlan = (options: FillOptions, seed: FillPlan['seed']): FillPlan | null => {
  const { target } = options;
  const match = target.pixels[seed.y * target.width + seed.x] ?? 0;
  const index = options.index & 255;
  if (match === index) {
    return null;
  }
  return {
    target,
    mask: options.mask ?? null,
    wrap: options.wrap ?? {},
    match,
    index,
    seed,
    reach: options.connectivity === 8 ? 1 : 0,
  };
};

const fillContiguousOf = (plan: FillPlan): Rect | null => (isWrapped(plan.wrap) ? fillWrapped(plan) : fillContiguous(plan));

const floodFill = (options: FillOptions): Rect | null => {
  const seed = foldPoint(options.seed, options.target, options.wrap);
  const plan = seedAllowed(options, seed) ? buildPlan(options, seed) : null;
  if (!plan) {
    return null;
  }
  return options.mode === 'global' ? fillGlobal(plan) : fillContiguousOf(plan);
};

export { floodFill };
