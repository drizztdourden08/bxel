/* @layer core @kind logic */
import { fillContiguous } from './fill-contiguous';
import { fillGlobal } from './fill-global';
import type { FillOptions, FillPlan } from './fill.type';
import type { Rect } from './geometry.type';
import { maskAllows } from './mask-allows';

const floodFill = (options: FillOptions): Rect | null => {
  const { target, seed, mode } = options;
  const inside = seed.x >= 0 && seed.y >= 0 && seed.x < target.width && seed.y < target.height;
  if (!inside || !maskAllows(options.mask, seed.x, seed.y)) {
    return null;
  }
  const match = target.pixels[seed.y * target.width + seed.x] ?? 0;
  const index = options.index & 255;
  if (match === index) {
    return null;
  }
  const plan: FillPlan = {
    target,
    mask: options.mask ?? null,
    match,
    index,
    seed,
    reach: options.connectivity === 8 ? 1 : 0,
  };
  return mode === 'global' ? fillGlobal(plan) : fillContiguous(plan);
};

export { floodFill };
