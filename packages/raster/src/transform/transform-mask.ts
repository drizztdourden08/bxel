/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { emptyMask } from '../selection/empty-mask';
import { forEachMove } from './for-each-move';
import type { Orientation } from './transform.type';

const transformMask = (mask: MaskView, orientation: Orientation): MaskView => {
  const moved = emptyMask(mask);
  forEachMove(mask, orientation, (_from, to) => {
    if (to >= 0) {
      moved.bits[to] = 1;
    }
  });
  return moved;
};

export { transformMask };
