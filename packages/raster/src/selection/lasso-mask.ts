/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Point, Size } from '../geometry.type';
import { polygonMask } from './polygon-mask';

const lassoMask = (size: Size, path: readonly Point[]): MaskView => {
  const steps = path.filter((point, at) => {
    const previous = path[at - 1];
    return !previous || Math.floor(previous.x) !== Math.floor(point.x) || Math.floor(previous.y) !== Math.floor(point.y);
  });
  return polygonMask(size, steps);
};

export { lassoMask };
