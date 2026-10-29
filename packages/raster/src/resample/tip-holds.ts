/* @layer core @kind logic */
import { allEqual } from './all-equal';
import type { Hood, TipSpec } from './mmpx.type';
import { noneEqual } from './none-equal';

const tipHolds = (n: Hood, spec: TipSpec): boolean =>
  n.luma(spec.x) < n.luma(n.e) && allEqual(n.e, ...spec.eqE) && noneEqual(n.e, ...spec.noneE);

export { tipHolds };
