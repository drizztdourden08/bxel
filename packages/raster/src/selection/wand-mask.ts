/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { floodFill } from '../flood-fill';
import { emptyMask } from './empty-mask';
import type { WandOptions } from './selection.type';

const wandMask = ({ target, seed, connectivity }: WandOptions): MaskView => {
  const mask = emptyMask(target);
  const match = target.pixels[seed.y * target.width + seed.x];
  const inside = seed.x >= 0 && seed.y >= 0 && seed.x < target.width && seed.y < target.height;
  if (!inside || match === undefined) {
    return mask;
  }
  const work = { pixels: target.pixels.slice(), width: target.width, height: target.height };
  floodFill({ target: work, seed, index: (match + 1) & 255, mode: 'contiguous', connectivity });
  for (const [at, value] of work.pixels.entries()) {
    if (value !== target.pixels[at]) {
      mask.bits[at] = 1;
    }
  }
  return mask;
};

export { wandMask };
