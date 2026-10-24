/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { createBounds } from '../create-bounds';
import { growBounds } from '../grow-bounds';
import { maskAllows } from '../mask-allows';
import type { ReplaceOptions, ReplaceResult } from './replace.type';

const replaceIndex = ({ target, from, to, mask }: ReplaceOptions): ReplaceResult => {
  const bounds = createBounds();
  let count = 0;
  if (from === to) {
    return { rect: null, count };
  }
  for (const [at, value] of target.pixels.entries()) {
    const x = at % target.width;
    const y = Math.floor(at / target.width);
    if (value === from && maskAllows(mask, x, y)) {
      target.pixels[at] = to;
      growBounds(bounds, x, y);
      count += 1;
    }
  }
  return { rect: boundsToRect(bounds), count };
};

export { replaceIndex };
