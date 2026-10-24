/* @layer renderer-app @kind logic */
import type { TransactionOk } from '@bxel/document';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { activeTarget } from '../active-target';
import type { OtherFrame, PendingEdit } from './pending.type';
import { previewImage } from './preview-image';

const otherFrames = (pending: PendingEdit, activeId: string, result: TransactionOk): OtherFrame[] => {
  const view = useDocumentStore.getState().host.view(pending.documentId);
  return pending.sprites
    .filter((id) => id !== activeId)
    .flatMap((spriteId) => {
      const target = activeTarget(view, null, spriteId);
      const frame = target ? previewImage(target, result) : null;
      return frame ? [{ spriteId, frame }] : [];
    });
};

export { otherFrames };
