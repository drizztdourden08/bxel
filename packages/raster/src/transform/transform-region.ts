/* @layer core @kind logic */
import { diffBounds } from '@bxel/document';
import { assertSameSize } from '../assert-same-size';
import { forEachMove } from './for-each-move';
import type { RegionOptions, RegionResult } from './transform.type';

const transformRegion = ({ target, mask, orientation }: RegionOptions): RegionResult => {
  assertSameSize(target, mask);
  const before = target.pixels.slice();
  forEachMove(mask, orientation, (from) => {
    target.pixels[from] = 0;
  });
  let clipped = 0;
  forEachMove(mask, orientation, (from, to) => {
    if (to < 0) {
      clipped += 1;
    } else {
      target.pixels[to] = before[from] ?? 0;
    }
  });
  return { rect: diffBounds(before, target.pixels, target.width), clipped };
};

export { transformRegion };
