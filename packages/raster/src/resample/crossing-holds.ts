/* @layer core @kind logic */
import { allEqual } from './all-equal';
import type { CrossingSpec } from './mmpx.type';

const crossingHolds = (e: number, spec: CrossingSpec): boolean =>
  e !== spec.x && allEqual(e, ...spec.eqE) && allEqual(spec.x, ...spec.eqX) && spec.x !== spec.far;

export { crossingHolds };
