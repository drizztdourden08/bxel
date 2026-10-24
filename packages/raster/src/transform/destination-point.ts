/* @layer core @kind logic */
import type { Point, Size } from '../geometry.type';
import { TRANSFORM_PLANS } from './transform.constants';
import type { Orientation } from './transform.type';
import { transformSize } from './transform-size';

const destinationPoint = (orientation: Orientation, size: Size, from: Point): Point => {
  const at = TRANSFORM_PLANS[orientation].to(from.x, from.y, size.width, size.height);
  const { width } = transformSize(orientation, size);
  return { x: at % width, y: Math.floor(at / width) };
};

export { destinationPoint };
