/* @layer core @kind logic */
import { allEqual } from './all-equal';
import type { ShallowSpec } from './mmpx.type';
import { noneEqual } from './none-equal';

const shallowHolds = (spec: ShallowSpec): boolean => spec.guard && allEqual(spec.x, ...spec.eq) && noneEqual(spec.x, ...spec.none);

export { shallowHolds };
