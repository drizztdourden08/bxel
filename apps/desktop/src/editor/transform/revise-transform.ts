/* @layer renderer-app @kind logic */
import { usePendingStore } from '../../stores/usePendingStore';
import { activeTransform } from './active-transform';
import { settleAlgorithm } from './settle-algorithm';
import type { TransformSpec } from './transform.type';

const reviseTransform = (change: (spec: TransformSpec) => TransformSpec): boolean => {
  const active = activeTransform();
  if (!active) return false;
  usePendingStore.getState().revise(settleAlgorithm(change(active.spec)));
  return true;
};

export { reviseTransform };
