/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { currentTarget } from '../current-target';
import { regionBox } from '../pending/region-box';
import type { PendingEdit } from '../pending/pending.type';

const transformBox = (pending: PendingEdit): Rect | null => {
  const target = currentTarget();
  return target ? regionBox(target, pending.mask) : null;
};

export { transformBox };
