/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { PointerEvent, RefObject } from 'react';
import { MAIN_BUTTON, MIDDLE_BUTTON } from '../PixelViewport.constants';
import type { PanDrag, PanDragging, ViewState } from './viewport.type';

const usePanDrag = (view: ViewState, spaceHeld: RefObject<boolean>, hand: boolean): PanDragging => {
  const drag = useRef<PanDrag | null>(null);
  const owns = (event: PointerEvent<HTMLElement>): boolean => drag.current?.pointer === event.pointerId;
  return {
    start: (event) => {
      const wanted = event.button === MIDDLE_BUTTON || (event.button === MAIN_BUTTON && (hand || spaceHeld.current));
      if (!wanted) return false;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.panning = '';
      drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, pan: view.latest.current.pan };
      return true;
    },
    move: (event) => {
      const from = drag.current;
      if (!from || !owns(event)) return false;
      const { zoom } = view.latest.current;
      view.apply({ zoom, pan: { x: from.pan.x - (event.clientX - from.x) / zoom, y: from.pan.y - (event.clientY - from.y) / zoom } });
      return true;
    },
    end: (event) => {
      if (!owns(event)) return false;
      drag.current = null;
      delete event.currentTarget.dataset.panning;
      return true;
    },
  };
};

export { usePanDrag };
