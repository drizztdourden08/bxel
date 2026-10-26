/* @layer renderer-app @kind logic */
import { animFramePivot } from '@bxel/document';
import type { Pivot2 } from '@bxel/document';
import { currentTarget } from '../../../editor/current-target';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';

const pivotNow = (): Pivot2 | null => {
  const target = currentTarget();
  const artwork = target ? useDocumentStore.getState().host.view(target.documentId)?.state.artwork : undefined;
  if (!target?.animation || !artwork) return null;
  const { animation, frame } = target.animation;
  return useTimelineStore.getState().pivotDraft ?? animFramePivot(artwork, animation, frame);
};

export { pivotNow };
