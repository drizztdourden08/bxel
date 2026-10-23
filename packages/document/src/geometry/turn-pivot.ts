/* @layer core @kind logic */
import type { Pivot2, Size, TurnDirection } from '../model/geometry.type';

const turnPivot = (pivot: Pivot2, size: Size, direction: TurnDirection): Pivot2 => {
  switch (direction) {
    case 'clockwise':
      return { x2: 2 * size.height - pivot.y2, y2: pivot.x2 };
    case 'counter-clockwise':
      return { x2: pivot.y2, y2: 2 * size.width - pivot.x2 };
    case 'half':
      return { x2: 2 * size.width - pivot.x2, y2: 2 * size.height - pivot.y2 };
  }
};

export { turnPivot };
