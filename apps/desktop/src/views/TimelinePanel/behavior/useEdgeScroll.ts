/* @layer renderer-app @kind hook */
import { useDragSession } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { edgeScrollStep } from './edge-scroll-step';
import type { Pointer } from './edge-scroll-step.type';
import { POINTER_EVENTS } from './useEdgeScroll.constants';
import { useFileDrag } from './useFileDrag';

const useEdgeScroll = (scroller: RefObject<HTMLElement | null>): void => {
  const session = useDragSession();
  const files = useFileDrag();
  const active = session !== null || files;
  useEffect(() => {
    const root = scroller.current;
    if (!active || !root) return undefined;
    let pointer: Pointer | null = null;
    const track = (event: MouseEvent): void => {
      pointer = { x: event.clientX, y: event.clientY };
    };
    POINTER_EVENTS.forEach((name) => window.addEventListener(name, track, true));
    let frame = 0;
    const tick = (): void => {
      const box = root.getBoundingClientRect();
      if (pointer) root.scrollLeft += edgeScrollStep(pointer, { x: box.left, y: box.top, width: box.width, height: box.height });
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      POINTER_EVENTS.forEach((name) => window.removeEventListener(name, track, true));
      window.cancelAnimationFrame(frame);
    };
  }, [active, scroller]);
};

export { useEdgeScroll };
