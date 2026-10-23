/* @layer core @kind logic */
import type { FlipAxis, Pivot2, Size } from '../model/geometry.type';

const flipPivot = (pivot: Pivot2, size: Size, axis: FlipAxis): Pivot2 => {
  if (axis === 'horizontal') return { x2: 2 * size.width - pivot.x2, y2: pivot.y2 };
  return { x2: pivot.x2, y2: 2 * size.height - pivot.y2 };
};

export { flipPivot };
