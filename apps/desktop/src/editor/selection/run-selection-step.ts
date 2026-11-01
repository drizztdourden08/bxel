/* @layer renderer-app @kind logic */
import type { TargetScope } from '@bxel/document';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { commitRequest } from '../commit-request';
import type { CommitStep } from '../commit-request.type';
import { currentTarget } from '../current-target';
import type { EditorTarget } from '../editor.type';
import { layerBlock } from '../layer-block';

const runSelectionStep = (label: string, step: CommitStep, scope?: (found: EditorTarget) => TargetScope): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const notices = useNoticeStore.getState();
  const blocked = layerBlock(target.layer);
  if (blocked !== null) {
    notices.post(blocked);
    return false;
  }
  const result = useDocumentStore.getState().host.execute(commitRequest(target, label, step, scope?.(target)));
  if (!result.ok) notices.post(result.error.message);
  return result.ok;
};

export { runSelectionStep };
