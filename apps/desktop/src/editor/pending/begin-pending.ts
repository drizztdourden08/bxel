/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../../stores/useNoticeStore';
import { usePendingStore } from '../../stores/usePendingStore';
import { buildPending } from './build-pending';
import type { PendingSpec } from './pending.type';

const beginPending = (spec: PendingSpec, editing = false): boolean => {
  const built = buildPending(spec, editing);
  if (!built) return false;
  if (built.blocked !== null) {
    useNoticeStore.getState().post(built.blocked);
    return false;
  }
  usePendingStore.getState().begin(built.pending);
  return true;
};

export { beginPending };
