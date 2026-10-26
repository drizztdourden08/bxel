/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { setPivot } from '../../../timeline/set-pivot';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { PivotAxis, PivotDrag } from './canvas-tools.type';
import { pivotFrame } from './pivot-frame';
import { pivotGrip } from './pivot-grip';
import { pivotNow } from './pivot-now';
import { pivotPosition } from './pivot-position';

const usePivotDrag = (viewport: RefObject<PixelViewportHandle | null>): PivotDrag => {
  const held = useRef<PivotAxis | null>(null);
  return {
    down: (event) => {
      const target = currentTarget();
      const pivot = pivotNow();
      const handle = viewport.current;
      const grabbed = handle && target?.animation && pivot ? pivotGrip(handle, pivotFrame(target), pivot, event) : null;
      if (!grabbed || !pivot) return false;
      held.current = grabbed;
      useTimelineStore.getState().setPivotDraft(pivot);
      event.currentTarget.setPointerCapture(event.pointerId);
      return true;
    },
    move: (event) => {
      const axis = held.current;
      const target = currentTarget();
      const pivot = useTimelineStore.getState().pivotDraft;
      if (!axis) return false;
      if (viewport.current && target && pivot) {
        const along = pivotPosition(viewport.current, axis, pivotFrame(target), event);
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
