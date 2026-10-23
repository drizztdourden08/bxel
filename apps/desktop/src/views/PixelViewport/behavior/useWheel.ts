/* @layer renderer-app @kind hook */
import { useEffect, useEffectEvent, useRef } from 'react';
import type { RefObject } from 'react';
import type { PixelWheel } from '../PixelViewport.type';
import type { ViewBox, ViewState } from './viewport.type';
import { rootOrigin } from './root-origin';
import { wheelDelta } from './wheel-delta';
import { wheelSteps } from './wheel-steps';

const useWheel = (rootRef: RefObject<HTMLElement | null>, view: ViewState, box: ViewBox, mode: PixelWheel): void => {
  const carried = useRef(0);
  const onWheel = useEffectEvent((event: WheelEvent) => {
    event.preventDefault();
    const delta = wheelDelta(event, box.height);
    const zooms = event.ctrlKey || event.metaKey || (mode === 'zoom' && !event.shiftKey && Math.abs(delta.y) >= Math.abs(delta.x));
    if (!zooms) {
      const { zoom } = view.latest.current;
      view.panBy(delta.x / zoom, delta.y / zoom);
      return;
    }
    const next = wheelSteps(carried.current, delta.y);
    carried.current = next.carried;
    if (next.steps === 0) return;
    const origin = rootOrigin(rootRef.current);
    view.zoomStep(next.steps, { x: event.clientX - origin.x, y: event.clientY - origin.y });
  });
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const listen = (event: WheelEvent) => onWheel(event);
    root.addEventListener('wheel', listen, { passive: false });
    return () => root.removeEventListener('wheel', listen);
  }, [rootRef]);
};

export { useWheel };
