/* @layer renderer-app @kind logic */
import type { TargetScope } from '@bxel/document';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { commitRequest } from '../commit-request';
import type { CommitStep } from '../commit-request.type';
import type { EditorTarget } from '../editor.type';
import { unlockedTarget } from '../unlocked-target';

const runSelectionStep = (label: string, step: CommitStep, scope?: (found: EditorTarget) => TargetScope): boolean => {
  const target = unlockedTarget();
  if (!target) return false;
  const notices = useNoticeStore.getState();
  const result = useDocumentStore.getState().host.execute(commitRequest(target, label, step, scope?.(target)));
  if (!result.ok) notices.post(result.error.message);
  return result.ok;
};

export { runSelectionStep };
