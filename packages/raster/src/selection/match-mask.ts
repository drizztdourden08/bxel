/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { emptyMask } from './empty-mask';
import { EIGHT } from './match-mask.constants';
import type { MatchOptions } from './selection.type';

const allowed = (options: MatchOptions, at: number, index: number): boolean => {
  if (options.ignore?.(index) === true) return false;
  return options.within ? options.within.bits[at] === 1 : true;
};

const everywhere = (options: MatchOptions, seedIndex: number, mask: MaskView): MaskView => {
  for (const [at, value] of options.target.pixels.entries()) {
    if (allowed(options, at, value) && options.matches(seedIndex, value)) mask.bits[at] = 1;
  }
  return mask;
};

const neighbours = (at: number, room: { readonly width: number; readonly height: number }, steps: readonly (readonly [number, number])[]): number[] => {
  const x = at % room.width;
  const y = Math.floor(at / room.width);
  return steps.flatMap(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    return nx >= 0 && ny >= 0 && nx < room.width && ny < room.height ? [ny * room.width + nx] : [];
  });
};

const region = (options: MatchOptions, seedIndex: number, mask: MaskView): MaskView => {
  const { width, pixels } = options.target;
  const steps = options.connectivity === 8 ? EIGHT : EIGHT.slice(0, 4);
  const queue: number[] = [options.seed.y * width + options.seed.x];
  const take = (at: number): boolean => {
    const value = pixels[at];
    if (value === undefined || mask.bits[at] === 1 || !allowed(options, at, value) || !options.matches(seedIndex, value)) return false;
    mask.bits[at] = 1;
    return true;
  };
  if (!take(queue[0] ?? 0)) return mask;
  for (const at of queue) {
    for (const next of neighbours(at, options.target, steps)) {
      if (take(next)) queue.push(next);
    }
  }
  return mask;
};

const matchMask = (options: MatchOptions): MaskView => {
  const { target, seed } = options;
  const mask = emptyMask(target);
  const inside = seed.x >= 0 && seed.y >= 0 && seed.x < target.width && seed.y < target.height;
  const seedIndex = options.seedIndex ?? (inside ? target.pixels[seed.y * target.width + seed.x] : undefined);
  if (seedIndex === undefined) return mask;
  return options.contiguous ? region(options, seedIndex, mask) : everywhere(options, seedIndex, mask);
};

export { matchMask };
