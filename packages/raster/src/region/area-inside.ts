/* @layer core @kind logic */
import type { Rect, Size } from '../geometry.type';

const areaInside = (size: Size, area: Rect): boolean =>
  area.x >= 0 && area.y >= 0 && area.x + area.width <= size.width && area.y + area.height <= size.height;

export { areaInside };
