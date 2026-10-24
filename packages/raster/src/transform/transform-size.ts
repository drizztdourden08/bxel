/* @layer core @kind logic */
import type { Size } from '../geometry.type';
import { TRANSFORM_PLANS } from './transform.constants';
import type { Orientation } from './transform.type';

const transformSize = (orientation: Orientation, { width, height }: Size): Size =>
  TRANSFORM_PLANS[orientation].turned ? { width: height, height: width } : { width, height };

export { transformSize };
