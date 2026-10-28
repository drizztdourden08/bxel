/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useViewStore } from '../../../stores/useViewStore';
import { WHEEL_NOTCH } from './useNavigatorWheel.constants';

const useNavigatorWheel = (target: RefObject<HTMLElement | null>): void => {
  const carried = useRef(0);
  useEffect(() => {
    const element = target.current;
    if (!element) return undefined;
    const listen = (event: WheelEvent) => {
      event.preventDefault();
      carried.current += event.deltaY;
      const steps = Math.trunc(carried.current / WHEEL_NOTCH);
      if (steps === 0) return;
      carried.current -= steps * WHEEL_NOTCH;
      const { viewport } = useViewStore.getState();
      if (steps < 0) viewport?.zoomIn();
      else viewport?.zoomOut();
    };
    element.addEventListener('wheel', listen, { passive: false });
    return () => element.removeEventListener('wheel', listen);
  }, [target]);
};

export { useNavigatorWheel };
