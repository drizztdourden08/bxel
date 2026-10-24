/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';

const areaTest =
  (area: Rect, columns: number) =>
  (index: number): boolean => {
    const x = index % columns;
    const y = (index - x) / columns;
    return x >= area.x && x < area.x + area.width && y >= area.y && y < area.y + area.height;
  };

export { areaTest };
