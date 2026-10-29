/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { WIDE_SHAPE } from '../SpritesPanel.constants';

const useWideShape = (target: RefObject<HTMLElement | null>): boolean => {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const element = target.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const watch = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setWide(box.width >= WIDE_SHAPE.minWidth && box.width >= box.height * WIDE_SHAPE.ratio);
    });
    watch.observe(element);
    return () => watch.disconnect();
  }, [target]);
  return wide;
};

export { useWideShape };
