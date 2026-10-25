/* @layer renderer-app @kind hook */
import type { VirtualGridHandle } from '@drizztdourden08/tessera';
import { useEffect } from 'react';
import type { RefObject } from 'react';

const useScrollToActive = (grid: RefObject<VirtualGridHandle | null>, index: number): void => {
  useEffect(() => {
    if (index >= 0) grid.current?.scrollToIndex(index);
  }, [grid, index]);
};

export { useScrollToActive };
