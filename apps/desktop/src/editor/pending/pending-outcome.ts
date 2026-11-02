/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';
import { currentTarget } from '../current-target';
import { PENDING_TEXT } from './pending.constants';
import type { PendingEdit, PendingOutcome } from './pending.type';
import { otherFrames } from './other-frames';
import { overlapNote } from './overlap-note';
import { pendingLanding } from './pending-landing';
import { pendingRequest } from './pending-request';
import { resultOutcome } from './result-outcome';
import { seamNote } from './seam-note';

const pendingOutcome = (pending: PendingEdit): PendingOutcome | null => {
  const target = currentTarget();
  if (!target) return null;
  if (target.documentId !== pending.documentId) return null;
  const { width, height } = target.sprite;
  const landing = pendingLanding(target, pending);
  const result = useDocumentStore.getState().host.execute(pendingRequest(target, pending, 'preview'));
  if (!result.ok) {
    return { width, height, frame: null, others: [], clipping: PENDING_TEXT.noClipping, error: result.error.message, landing };
  }
  const base = { ...resultOutcome(target, result, landing), others: otherFrames(pending, target.sprite.id, result) };
  const clipping = overlapNote(target, base, base.others);
  const seams = seamNote(target.sprite, pending.spec);
  return { ...base, clipping: seams ? `${clipping}, ${seams}` : clipping };
};

export { pendingOutcome };
