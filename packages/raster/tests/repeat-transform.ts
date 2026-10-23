/* @layer tests @kind logic */
import { transformBuffer, transformPivot, transformSize } from '@bxel/raster';
import type { Orientation } from '@bxel/raster';
import type { Repeated } from './repeat-transform.type';

const repeatTransform = (start: Repeated, orientation: Orientation, times: number): Repeated => {
  let current = start;
  for (let step = 0; step < times; step++) {
    current = {
      view: transformBuffer(current.view, orientation),
      size: transformSize(orientation, current.size),
      pivot: transformPivot(orientation, current.size, current.pivot),
    };
  }
  return current;
};

export { repeatTransform };
