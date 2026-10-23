/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Pivot2, Size } from '../model/geometry.type';

const checkPivot = (pivot: Pivot2, size: Size): void => {
  const inside = pivot.x2 >= 0 && pivot.x2 <= 2 * size.width && pivot.y2 >= 0 && pivot.y2 <= 2 * size.height;
  if (!inside) {
    throw fail(ERROR_CODE.PIVOT_OUT_OF_RANGE, `The pivot is within 0..${2 * size.width} and 0..${2 * size.height}.`);
  }
};

export { checkPivot };
