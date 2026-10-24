/* @layer core @kind logic */
import type { Draft } from '../draft/draft.type';
import type { UndoOp } from './history.type';
import { recordPending } from './record-pending';

const collectOps = (draft: Draft): UndoOp[] => {
  recordPending(draft);
  return [...draft.ops];
};

export { collectOps };
