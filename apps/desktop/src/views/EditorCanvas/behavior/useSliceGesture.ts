/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { PointerEvent, RefObject } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { PRIMARY_BUTTON } from '../../../editor/tools.constants';
import { snapEdge } from '../../../guides/snap-edge';
import { beginSliceDrag } from '../../../slice/begin-slice-drag';
import { extendSliceDrag } from '../../../slice/extend-slice-drag';
import { finishSliceDrag } from '../../../slice/finish-slice-drag';
import { sliceAt } from '../../../slice/slice-at';
import { sliceDraft } from '../../../slice/slice-draft';
import { useSliceToolStore } from '../../../stores/useSliceToolStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { SelectGesture } from './canvas-tools.type';
import { DOUBLE_CLICK } from './useSliceGesture.constants';

const useSliceGesture = (viewport: RefObject<PixelViewportHandle | null>): SelectGesture => {
  const held = useRef(false);
  const rawAt = (event: PointerEvent<HTMLElement>) => viewport.current?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 };
  return {
    down: (event) => {
      const handle = viewport.current;
      const target = currentTarget();
      if (useToolStore.getState().tool !== 'slice' || event.button !== PRIMARY_BUTTON || !handle || !target) return false;
      const raw = rawAt(event);
      const hit = sliceAt(raw);
      if (event.detail >= DOUBLE_CLICK && hit) {
        useSliceToolStore.getState().openDialog(hit.id);
        return true;
      }
      const zoom = handle.view().zoom;
      sliceDraft.current = beginSliceDrag(raw, snapEdge(raw, zoom), zoom);
      held.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      handle.redraw();
      return true;
    },
    move: (event) => {
      const handle = viewport.current;
      const target = currentTarget();
      if (!held.current || !handle || !target || !sliceDraft.current) return false;
      sliceDraft.current = extendSliceDrag(sliceDraft.current, snapEdge(rawAt(event), handle.view().zoom), target.sprite);
      handle.redraw();
      return true;
    },
    up: () => {
      if (!held.current) return false;
      held.current = false;
      const drag = sliceDraft.current;
      sliceDraft.current = null;
      if (drag) finishSliceDrag(drag);
      viewport.current?.redraw();
      return true;
    },
  };
};

export { useSliceGesture };
