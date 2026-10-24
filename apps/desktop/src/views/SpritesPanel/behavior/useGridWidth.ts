/* @layer renderer-app @kind hook */
import { observeResize } from '@drizztdourden08/tessera';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { GRID_START_WIDTH } from '../SpritesPanel.constants';

const useGridWidth = (area: RefObject<HTMLElement | null>): number => {
  const [width, setWidth] = useState(GRID_START_WIDTH);
  useEffect(() => {
    const node = area.current;
    if (!node) return undefined;
    setWidth(node.clientWidth || GRID_START_WIDTH);
    return observeResize([node], () => setWidth(node.clientWidth || GRID_START_WIDTH));
  }, [area]);
  return width;
};

export { useGridWidth };
