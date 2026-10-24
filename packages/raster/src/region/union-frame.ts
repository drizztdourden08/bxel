/* @layer core @kind logic */
import type { Rect, Size } from '../geometry.type';

const unionFrame = (size: Size, area: Rect): Rect => {
  const x = Math.min(0, area.x);
  const y = Math.min(0, area.y);
  return {
    x,
    y,
    width: Math.max(size.width, area.x + area.width) - x,
    height: Math.max(size.height, area.y + area.height) - y,
  };
};

export { unionFrame };
