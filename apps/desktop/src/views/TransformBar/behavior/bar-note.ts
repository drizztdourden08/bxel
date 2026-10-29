/* @layer renderer-app @kind logic */
import type { PendingOutcome } from '../../../editor/pending/pending.type';

const barNote = (outcome: PendingOutcome | null): string | null => {
  if (!outcome) return null;
  if (outcome.error) return outcome.error;
  return outcome.clipping === 'none' ? null : outcome.clipping;
};

export { barNote };
