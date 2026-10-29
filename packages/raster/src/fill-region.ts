/* @layer core @kind logic */
import { connectedRegion } from './connected-region';
import type { RegionFill } from './fill-region.type';
import { foldPoint } from './fold-point';
import { globalRegion } from './global-region';
import { maskAllows } from './mask-allows';

const classOf = (options: RegionFill, sample: Uint8Array, offset: number): number => {
  const value = sample[offset] ?? 0;
  return options.classes ? (options.classes[value] ?? value) : value;
};

const fillRegion = (options: RegionFill): Uint8Array => {
  const { target } = options;
  const { width, height } = target;
  const sample = options.sample ?? target.pixels;
  const seed = foldPoint(options.seed, target, options.wrap);
  if (seed.x < 0 || seed.y < 0 || seed.x >= width || seed.y >= height) return new Uint8Array(width * height);
  const match = classOf(options, sample, seed.y * width + seed.x);
  const open = (x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < width && y < height && maskAllows(options.mask, x, y) && classOf(options, sample, y * width + x) === match;
  return options.mode === 'global' ? globalRegion(target, open) : connectedRegion(options, seed, open);
};

export { fillRegion };
