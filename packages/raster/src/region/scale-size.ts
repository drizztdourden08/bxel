/* @layer core @kind logic */
import type { Rect, Size } from '../geometry.type';
import type { ScaleTarget } from './region.type';

const scaleSize = (target: ScaleTarget, box: Rect): Size =>
  target.by === 'size'
    ? { width: target.width, height: target.height }
    : { width: box.width * target.x, height: box.height * target.y };

export { scaleSize };
