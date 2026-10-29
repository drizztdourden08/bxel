/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { commitRequest } from '../commit-request';
import type { CommitStep } from '../commit-request.type';
import { currentTarget } from '../current-target';
import { layerBlock } from '../layer-block';

const runSelectionStep = (label: string, step: CommitStep): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const notices = useNoticeStore.getState();
  const blocked = layerBlock(target.layer);
  if (blocked !== null) {
    notices.post(blocked);
    return false;
  }
  const result = useDocumentStore.getState().host.execute(commitRequest(target, label, step));
  if (!result.ok) notices.post(result.error.message);
  return result.ok;
};

export { runSelectionStep };
