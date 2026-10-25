/* @layer renderer-app @kind logic */
import type { TransactionResult } from '@bxel/document';
import { commitHandoff } from './commit-handoff';
import { currentTarget } from './current-target';
import type { PaintSession } from './editor.type';
import { handoffRect } from './handoff-rect';

const handOffImage = (session: PaintSession, image: ImageData, result: TransactionResult | null): void => {
  commitHandoff.current = null;
  const after = currentTarget();
  if (!result?.ok || result.noop || !after) return;
  if (session.revision !== result.baseRevision || after.revision !== result.revision) return;
  const rect = handoffRect(session, after, result.changes);
  if (!rect) return;
  const { documentId, sprite, frameId } = after;
  commitHandoff.current = { image, documentId, spriteId: sprite.id, frameId, from: result.baseRevision, to: result.revision, rect };
};

export { handOffImage };
