/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';

const onRectBorder = (rect: Rect, x: number, y: number): boolean =>
  x === rect.x || y === rect.y || x === rect.x + rect.width - 1 || y === rect.y + rect.height - 1;

export { onRectBorder };
