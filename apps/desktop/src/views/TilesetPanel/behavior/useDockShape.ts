/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { WIDE_DOCK } from '../TilesetPanel.constants';

const useDockShape = (): { ref: RefObject<HTMLElement | null>; wide: boolean } => {
  const ref = useRef<HTMLElement | null>(null);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const watcher = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      setWide(box !== undefined && box.width >= WIDE_DOCK.minWidth && box.width >= box.height * WIDE_DOCK.ratio);
    });
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);
  return { ref, wide };
};

export { useDockShape };
