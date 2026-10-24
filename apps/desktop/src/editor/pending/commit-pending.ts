/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { usePendingStore } from '../../stores/usePendingStore';
import { currentTarget } from '../current-target';
import { setSelection } from '../selection/set-selection';
import { pendingRequest } from './pending-request';

const commitPending = (): boolean => {
  const { pending, outcome } = usePendingStore.getState();
  const target = currentTarget();
  if (!pending || !target) return false;
  if (target.documentId !== pending.documentId || outcome?.error) return false;
  const result = useDocumentStore.getState().host.execute(pendingRequest(target, pending, 'commit'));
  if (!result.ok) {
    useNoticeStore.getState().post(result.error.message);
    return false;
  }
  setSelection(target, outcome?.landing ?? null);
  usePendingStore.getState().clear();
  return true;
};

export { commitPending };
