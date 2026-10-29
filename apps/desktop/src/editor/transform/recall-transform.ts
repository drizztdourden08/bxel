/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useTransformUiStore } from '../../stores/useTransformUiStore';
import { currentTarget } from '../current-target';
import { beginPending } from '../pending/begin-pending';
import { newestTag } from '../selection/newest-tag';

const recallTransform = (): boolean => {
  const { last, setLast } = useTransformUiStore.getState();
  const target = currentTarget();
  if (!target || last?.documentId !== target.documentId || last.tag !== newestTag(target.documentId)) return false;
  setLast(null);
  useDocumentStore.getState().host.undo(target.documentId);
  return beginPending(last.spec);
};

export { recallTransform };
