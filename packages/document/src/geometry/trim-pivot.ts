/* @layer core @kind logic */
import type { Pivot2, Rect } from '../model/geometry.type';

const trimPivot = (pivot: Pivot2, trim: Rect): Pivot2 => ({ x2: pivot.x2 - 2 * trim.x, y2: pivot.y2 - 2 * trim.y });

export { trimPivot };
