/* @layer renderer-app @kind logic */
import { currentTarget } from '../current-target';
import { beginPending } from '../pending/begin-pending';
import { regionBox } from '../pending/region-box';
import { selectionMask } from '../selection/selection-mask';

const startScale = (): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const { width, height } = regionBox(target, selectionMask(target));
  return beginPending({ kind: 'scale', width, height, bounds: 'crop' }, true);
};

export { startScale };
