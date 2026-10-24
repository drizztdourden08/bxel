/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { PendingOutcome } from '../../../editor/pending/pending.type';
import type { FrameImage } from '../../../sheet/sheet.type';

const pendingOverrides = (outcome: PendingOutcome | null, activeId: SpriteId | null): ReadonlyMap<SpriteId, FrameImage> => {
  const found = new Map<SpriteId, FrameImage>();
  if (!outcome) return found;
  if (outcome.frame && activeId !== null) found.set(activeId, outcome.frame);
  for (const other of outcome.others) found.set(other.spriteId, other.frame);
  return found;
};

export { pendingOverrides };
