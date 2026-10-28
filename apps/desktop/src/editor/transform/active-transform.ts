/* @layer renderer-app @kind logic */
import { usePendingStore } from '../../stores/usePendingStore';
import type { PendingEdit } from '../pending/pending.type';
import type { TransformSpec } from './transform.type';

interface ActiveTransform {
  pending: PendingEdit;
  spec: TransformSpec;
}

const activeTransform = (): ActiveTransform | null => {
  const { pending } = usePendingStore.getState();
  return pending?.spec.kind === 'transform' ? { pending, spec: pending.spec } : null;
};

export { activeTransform };
export type { ActiveTransform };
