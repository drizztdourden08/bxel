/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { createBounds } from '../create-bounds';
import { growBounds } from '../grow-bounds';
import { maskAllows } from '../mask-allows';
import type { ReplaceRampOptions, ReplaceResult } from './replace.type';

/** The slot of the target ramp for a step of the source ramp: the same place along it, so ramps of unequal length line up end to end. */
const stepTarget = (position: number, from: number, to: readonly number[]): number | undefined => {
  if (to.length === 1 || from === 1) return to[0];
  return to[Math.round((position * (to.length - 1)) / (from - 1))];
};

/** Maps each step of the source ramp to the step at the same place on the target ramp. Other indices stay. */
const rampTable = (from: readonly number[], to: readonly number[]): Map<number, number> => {
  const table = new Map<number, number>();
  from.forEach((slot, position) => {
    const target = stepTarget(position, from.length, to);
    if (target !== undefined && target !== slot) table.set(slot, target);
  });
  return table;
};

const replaceRamp = ({ target, from, to, mask }: ReplaceRampOptions): ReplaceResult => {
  const bounds = createBounds();
  const table = rampTable(from, to);
  let count = 0;
  if (table.size === 0) return { rect: null, count };
  for (const [at, value] of target.pixels.entries()) {
    const next = table.get(value);
    if (next === undefined) continue;
    const x = at % target.width;
    const y = Math.floor(at / target.width);
    if (!maskAllows(mask, x, y)) continue;
    target.pixels[at] = next;
    growBounds(bounds, x, y);
    count += 1;
  }
  return { rect: boundsToRect(bounds), count };
};

export { rampTable, replaceRamp };
