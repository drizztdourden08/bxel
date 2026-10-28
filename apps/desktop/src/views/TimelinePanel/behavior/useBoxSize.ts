/* @layer renderer-app @kind hook */
import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

interface BoxSize {
  width: number;
  height: number;
}

const useBoxSize = (ref: RefObject<HTMLElement | null>): BoxSize => {
  const [size, setSize] = useState<BoxSize>({ width: 1024, height: 240 });
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const read = (): void => {
      const box = element.getBoundingClientRect();
      setSize((now) => (now.width === Math.round(box.width) && now.height === Math.round(box.height) ? now : { width: Math.round(box.width), height: Math.round(box.height) }));
    };
    read();
    const watch = new ResizeObserver(read);
    watch.observe(element);
    return () => watch.disconnect();
  }, [ref]);
  return size;
};

export { useBoxSize };
