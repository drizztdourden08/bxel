/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { createBounds } from '../create-bounds';
import { growBounds } from '../grow-bounds';
import { maskAllows } from '../mask-allows';
import { rampTable } from './ramp-table';
import type { ReplaceRampOptions, ReplaceResult } from './replace.type';

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

export { replaceRamp };
