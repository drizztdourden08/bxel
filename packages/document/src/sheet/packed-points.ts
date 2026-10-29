/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Point, Size } from '../model/geometry.type';
import type { SheetGap } from './sheet-gap.type';
import { shelfOrder } from './shelf-order';

const packedPoints = (sizes: readonly Size[], maxWidth: number, gap: SheetGap, strict: number = sizes.length): Point[] => {
  const { spacing, margin } = gap;
  const points: Point[] = sizes.map(() => ({ x: 0, y: 0 }));
  let x = margin;
  let y = margin;
  let shelf = 0;
  for (const index of shelfOrder(sizes)) {
    const size = sizes[index];
    if (!size) continue;
    if (index < strict && size.width > maxWidth - 2 * margin) {
      throw fail(ERROR_CODE.SIZE_OUT_OF_RANGE, `A sprite of ${size.width} pixels does not fit a sheet ${maxWidth} pixels wide.`);
    }
    if (x > margin && x + size.width > maxWidth - margin) {
      y += shelf + spacing.y;
      x = margin;
      shelf = 0;
    }
    points[index] = { x, y };
    x += size.width + spacing.x;
    shelf = Math.max(shelf, size.height);
  }
  return points;
};

export { packedPoints };
