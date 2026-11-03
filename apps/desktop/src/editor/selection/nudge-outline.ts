/* @layer renderer-app @kind logic */
import { useToolStore } from '../../stores/useToolStore';
import { currentTarget } from '../current-target';
import { floatOffset } from '../pending/float-offset';
import { shiftMask } from '../pending/shift-mask';
import { commitSelection } from './commit-selection';
import { selectionMask } from './selection-mask';

const nudgeOutline = (dx: number, dy: number): boolean => {
  if (useToolStore.getState().tool !== 'select' || floatOffset() !== null) return false;
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  if (!target || !mask) return false;
  commitSelection(target, shiftMask(mask, { x: dx, y: dy }));
  return true;
};

export { nudgeOutline };
