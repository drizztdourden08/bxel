/* @layer core @kind logic */
import type { FlipAxis, Point, Size } from '../model/geometry.type';

const flipPoint = (point: Point, size: Size, axis: FlipAxis): Point => {
  if (axis === 'horizontal') return { x: size.width - 1 - point.x, y: point.y };
  return { x: point.x, y: size.height - 1 - point.y };
};

export { flipPoint };
