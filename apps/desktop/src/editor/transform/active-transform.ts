/* @layer renderer-app @kind logic */
import { usePendingStore } from '../../stores/usePendingStore';
import type { ActiveTransform } from './active-transform.type';

const activeTransform = (): ActiveTransform | null => {
  const { pending } = usePendingStore.getState();
  return pending?.spec.kind === 'transform' ? { pending, spec: pending.spec } : null;
};

export { activeTransform };
