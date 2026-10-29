/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { stepZoom } from '../../../timeline/step-zoom';

const useWheelZoom = (area: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const element = area.current;
    if (!element) return undefined;
    const onWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const store = useTimelineStore.getState();
      store.setZoom(stepZoom(store.zoom, event.deltaY < 0 ? 1 : -1));
    };
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [area]);
};

export { useWheelZoom };
