/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';
import { currentTarget } from '../current-target';
import { PENDING_TEXT } from './pending.constants';
import type { PendingEdit, PendingOutcome } from './pending.type';
import { pendingLanding } from './pending-landing';
import { pendingRequest } from './pending-request';
import { resultOutcome } from './result-outcome';

const pendingOutcome = (pending: PendingEdit): PendingOutcome | null => {
  const target = currentTarget();
  if (!target) return null;
  if (target.documentId !== pending.documentId) return null;
  const { width, height } = target.sprite;
  const landing = pendingLanding(target, pending);
  const result = useDocumentStore.getState().host.execute(pendingRequest(target, pending, 'preview'));
  if (!result.ok) return { width, height, frame: null, clipping: PENDING_TEXT.noClipping, error: result.error.message, landing };
  return resultOutcome(target, result, landing);
};

export { pendingOutcome };
