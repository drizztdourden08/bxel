/* @layer core @kind logic */
import type { Draft } from '../draft/draft.type';
import { flushCels } from '../draft/flush-cels';
import { collectionOps } from './collection-ops';
import type { UndoOp } from './history.type';
import { spriteOps } from './sprite-ops';

const collectOps = (draft: Draft): UndoOp[] => {
  flushCels(draft);
  return [...draft.ops, ...collectionOps(draft.base, draft.project), ...spriteOps(draft.base, draft.project)];
};

export { collectOps };
