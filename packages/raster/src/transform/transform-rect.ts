/* @layer core @kind logic */
import type { Rect, Size } from '../geometry.type';
import { destinationPoint } from './destination-point';
import type { Orientation } from './transform.type';

const transformRect = (orientation: Orientation, size: Size, rect: Rect): Rect => {
  const first = destinationPoint(orientation, size, { x: rect.x, y: rect.y });
  const second = destinationPoint(orientation, size, { x: rect.x + rect.width - 1, y: rect.y + rect.height - 1 });
  const x = Math.min(first.x, second.x);
  const y = Math.min(first.y, second.y);
  return { x, y, width: Math.max(first.x, second.x) - x + 1, height: Math.max(first.y, second.y) - y + 1 };
};

export { transformRect };
