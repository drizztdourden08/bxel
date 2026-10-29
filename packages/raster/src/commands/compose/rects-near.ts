/* @layer core @kind logic */
import type { Rect } from '../../geometry.type';

const rectsNear = (a: Rect, b: Rect, gap: number): boolean =>
  a.x - gap <= b.x + b.width && b.x - gap <= a.x + a.width && a.y - gap <= b.y + b.height && b.y - gap <= a.y + a.height;

export { rectsNear };
