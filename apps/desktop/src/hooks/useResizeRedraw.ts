/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';

const useResizeRedraw = (ref: RefObject<HTMLElement | null>, redraw: () => void): void => {
  useEffect(() => {
    const element = ref.current;
    const view = element?.ownerDocument.defaultView;
    if (!element || !view) return undefined;
    const observer = new view.ResizeObserver(redraw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, redraw]);
};

export { useResizeRedraw };
