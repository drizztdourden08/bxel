/* @layer core @kind logic */
import type { Draft } from '../draft/draft.type';
import { flushCels } from '../draft/flush-cels';
import { collectionOps } from './collection-ops';
import { spriteOps } from './sprite-ops';

const recordPending = (draft: Draft, final = false): void => {
  flushCels(draft, final);
  draft.ops.push(...collectionOps(draft.recorded, draft.artwork), ...spriteOps(draft.recorded, draft.artwork));
  draft.recorded = draft.artwork;
};

export { recordPending };
