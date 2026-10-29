/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import { heldKeys } from '../../../editor/selection/held-keys';
import { activeTransform } from '../../../editor/transform/active-transform';
import { dragTransform } from '../../../editor/transform/drag-transform';
import { grabOf } from '../../../editor/transform/grab-of';
import type { Grab } from '../../../editor/transform/transform.type';
import { PRIMARY_BUTTON } from '../../../editor/tools.constants';
import { usePendingStore } from '../../../stores/usePendingStore';
import { useTransformUiStore } from '../../../stores/useTransformUiStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { AxisDrag } from './canvas-tools.type';
import { handleCursor } from './handle-cursor';
import { transformHit } from './transform-hit';

const useTransformGesture = (viewport: RefObject<PixelViewportHandle | null>): AxisDrag => {
  const held = useRef<Grab | null>(null);
  return {
    down: (event) => {
      if (!activeTransform()) return false;
      const hit = transformHit(viewport.current, event);
      if (event.button !== PRIMARY_BUTTON || !hit?.handle) return true;
      held.current = grabOf({ box: hit.box, spec: hit.spec, point: hit.point, handle: hit.handle }, heldKeys(event));
      usePendingStore.getState().revise(held.current.spec);
      useTransformUiStore.getState().setGrab(hit.handle);
      event.currentTarget.setPointerCapture(event.pointerId);
      return true;
    },
    move: (event) => {
      if (!activeTransform()) return false;
      const grab = held.current;
      if (grab) {
        const point = viewport.current?.screenToPixel(event.clientX, event.clientY);
        if (point) usePendingStore.getState().revise(dragTransform(grab, point, heldKeys(event)));
        return true;
      }
      event.currentTarget.style.cursor = handleCursor(transformHit(viewport.current, event)?.handle ?? null);
      viewport.current?.redraw();
      return true;
    },
    up: () => {
      const grab = held.current;
      held.current = null;
      if (grab) useTransformUiStore.getState().setGrab(null);
      return grab !== null || activeTransform() !== null;
    },
  };
};

export { useTransformGesture };
