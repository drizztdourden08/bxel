/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { StageSize } from '../AssetPreview.type';

const EMPTY: StageSize = { width: 0, height: 0 };

const useStageSize = (target: RefObject<HTMLElement | null>): StageSize => {
  const [size, setSize] = useState<StageSize>(EMPTY);
  useEffect(() => {
    const element = target.current;
    if (!element) return undefined;
    const read = (): void => setSize({ width: element.clientWidth, height: element.clientHeight });
    read();
    const watcher = new ResizeObserver(read);
    watcher.observe(element);
    return () => watcher.disconnect();
  }, [target]);
  return size;
};

export { useStageSize };
