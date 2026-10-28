/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelPoint } from '../../PixelViewport';
import { visibleRect } from './visible-rect';

interface NavigatorPointer {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
}

const imagePoint = (event: PointerEvent<HTMLElement>, scale: number): PixelPoint => {
  const box = event.currentTarget.getBoundingClientRect();
  return { x: (event.clientX - box.left) / scale, y: (event.clientY - box.top) / scale };
};

const useNavigatorPointer = (scale: number): NavigatorPointer => {
  const grab = useRef<PixelPoint | null>(null);
  return {
    onPointerDown: (event) => {
      const { view } = useViewFeedStore.getState();
      const { viewport } = useViewStore.getState();
      if (event.button !== 0 || !view || !viewport) return;
      const at = imagePoint(event, scale);
      const rect = visibleRect(view);
      const inside = at.x >= rect.x && at.x <= rect.x + rect.width && at.y >= rect.y && at.y <= rect.y + rect.height;
      grab.current = inside ? { x: at.x - view.pan.x, y: at.y - view.pan.y } : { x: 0, y: 0 };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.focus({ preventScroll: true });
      if (!inside) viewport.panTo(at);
    },
    onPointerMove: (event) => {
      const held = grab.current;
      const { viewport } = useViewStore.getState();
      if (!held || !viewport) return;
      const at = imagePoint(event, scale);
      viewport.panTo({ x: at.x - held.x, y: at.y - held.y });
    },
    onPointerUp: (event) => {
      grab.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    },
  };
};

export type { NavigatorPointer };
export { useNavigatorPointer };
