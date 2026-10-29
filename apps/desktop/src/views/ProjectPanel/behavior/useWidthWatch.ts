/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';

const useWidthWatch = (ref: RefObject<HTMLElement | null>, onWidth: (width: number) => void): void => {
  useEffect(() => {
    const element = ref.current;
    if (element === null) return undefined;
    onWidth(element.clientWidth);
    const watch = new ResizeObserver(() => onWidth(element.clientWidth));
    watch.observe(element);
    return () => watch.disconnect();
  }, [ref, onWidth]);
};

export { useWidthWatch };
