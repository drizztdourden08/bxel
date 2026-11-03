/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { VirtualListHandle } from '@drizztdourden08/tessera';
import type { RefObject } from 'react';

const useKeepCurrentVisible = (list: RefObject<VirtualListHandle | null>, index: number, layoutKey: number): void => {
  useEffect(() => {
    if (index >= 0) list.current?.scrollToIndex(index, 'nearest');
  }, [list, index, layoutKey]);
};

export { useKeepCurrentVisible };
