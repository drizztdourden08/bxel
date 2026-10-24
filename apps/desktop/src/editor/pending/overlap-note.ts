/* @layer renderer-app @kind logic */
import type { Size, SpriteId } from '@bxel/document';
import { layoutConflicts } from '../../sheet/layout-conflicts';
import { useDocumentStore } from '../../stores/useDocumentStore';
import type { EditorTarget } from '../editor.type';
import { PENDING_TEXT } from './pending.constants';
import type { OtherFrame, PendingOutcome } from './pending.type';

const overlapNote = (target: EditorTarget, outcome: PendingOutcome, others: readonly OtherFrame[]): string => {
  const resized = new Map<SpriteId, Size>(others.map((other) => [other.spriteId, other.frame] as const));
  if (outcome.frame) resized.set(target.sprite.id, outcome.frame);
  const view = useDocumentStore.getState().host.view(target.documentId);
  const count = view ? layoutConflicts(view.state.artwork, target.sprite.id, resized) : 0;
  return count > 0 ? `${outcome.clipping}, ${PENDING_TEXT.overlaps(count)}` : outcome.clipping;
};

export { overlapNote };
