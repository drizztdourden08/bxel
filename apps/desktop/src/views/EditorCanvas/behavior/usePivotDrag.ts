/* @layer renderer-app @kind hook */
import { animFramePivot } from '@bxel/document';
import { useRef } from 'react';
import type { RefObject } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { setPivot } from '../../../timeline/set-pivot';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { PivotDrag, PivotAxis, PivotFrame } from './canvas-tools.type';
import { pivotGrip } from './pivot-grip';
import { pivotPosition } from './pivot-position';

const frameOf = (): PivotFrame | null => {
  const target = currentTarget();
  const clip = target?.animation?.frame.clip;
  return target ? { x: clip?.x ?? 0, y: clip?.y ?? 0, width: clip?.width ?? target.sprite.width, height: clip?.height ?? target.sprite.height } : null;
};

const pivotNow = () => {
  const target = currentTarget();
  const artwork = target ? useDocumentStore.getState().host.view(target.documentId)?.state.artwork : undefined;
  if (!target?.animation || !artwork) return null;
  const { animation, frame } = target.animation;
  return useTimelineStore.getState().pivotDraft ?? animFramePivot(artwork, animation, frame);
};

const usePivotDrag = (viewport: RefObject<PixelViewportHandle | null>): PivotDrag => {
  const held = useRef<PivotAxis | null>(null);
  return {
    down: (event) => {
      const handle = viewport.current;
      const target = currentTarget();
      const frame = frameOf();
      const pivot = pivotNow();
      if (!handle || !target?.animation || !frame || !pivot) return false;
      const grabbed = pivotGrip(handle, frame, pivot, target.sprite, event);
      if (!grabbed) return false;
      held.current = grabbed;
      useTimelineStore.getState().setPivotDraft(pivot);
      event.currentTarget.setPointerCapture(event.pointerId);
      return true;
    },
    move: (event) => {
      const axis = held.current;
      const handle = viewport.current;
      const frame = frameOf();
      const pivot = useTimelineStore.getState().pivotDraft;
      if (!axis) return false;
      if (handle && frame && pivot) {
        const along = pivotPosition(handle, axis, frame, event);
        useTimelineStore.getState().setPivotDraft(axis === 'x' ? { ...pivot, x2: along } : { ...pivot, y2: along });
      }
      return true;
    },
    up: () => {
      const axis = held.current;
      held.current = null;
      if (!axis) return false;
      const draft = useTimelineStore.getState().pivotDraft;
      useTimelineStore.getState().setPivotDraft(null);
      if (draft) setPivot(draft.x2, draft.y2);
      return true;
    },
  };
};

export { usePivotDrag };
