/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import { heldKeys } from '../../../editor/selection/held-keys';
import { PRIMARY_BUTTON } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { ZOOM_SCRUB_PIXELS } from '../EditorCanvas.constants';
import type { SelectGesture } from './canvas-tools.type';
import { zoomAtPointer } from './zoom-at-pointer';
import { zoomDraft } from './zoom-draft';
import { zoomRectOf } from './zoom-rect-of';

interface ZoomPress {
  readonly startX: number;
  readonly startY: number;
  readonly startZoom: number;
  readonly rect: boolean;
  moved: boolean;
}

const MOVE_SLOP = 3;

const useZoomGesture = (viewport: RefObject<PixelViewportHandle | null>): SelectGesture => {
  const press = useRef<ZoomPress | null>(null);
  return {
    down: (event) => {
      const handle = viewport.current;
      if (useToolStore.getState().tool !== 'zoom' || event.button !== PRIMARY_BUTTON || !handle) return false;
      const keys = heldKeys(event);
      if (keys.altKey) {
        zoomAtPointer(handle, event, true);
        return true;
      }
      press.current = { startX: event.clientX, startY: event.clientY, startZoom: handle.view().zoom, rect: keys.ctrlKey, moved: false };
      if (keys.ctrlKey) {
        const from = handle.screenToPixel(event.clientX, event.clientY);
        zoomDraft.current = { from, to: from };
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      return true;
    },
    move: (event) => {
      const held = press.current;
      const handle = viewport.current;
      if (!held || !handle) return false;
      const dx = event.clientX - held.startX;
      held.moved = held.moved || Math.abs(dx) > MOVE_SLOP || Math.abs(event.clientY - held.startY) > MOVE_SLOP;
      if (held.rect && zoomDraft.current) zoomDraft.current = { ...zoomDraft.current, to: handle.screenToPixel(event.clientX, event.clientY) };
      else if (held.moved) handle.setZoom(held.startZoom * 2 ** (dx / ZOOM_SCRUB_PIXELS), { x: held.startX, y: held.startY });
      handle.redraw();
      return true;
    },
    up: () => {
      const held = press.current;
      const handle = viewport.current;
      press.current = null;
      if (!held) return false;
      const draft = zoomDraft.current;
      zoomDraft.current = null;
      if (!held.moved) handle?.zoomIn({ x: held.startX, y: held.startY });
      else if (draft) handle?.zoomToRect(zoomRectOf(draft));
      handle?.redraw();
      return true;
    },
  };
};

export { useZoomGesture };
