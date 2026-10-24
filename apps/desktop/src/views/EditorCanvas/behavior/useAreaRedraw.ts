/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useAreaStore } from '../../../stores/useAreaStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const useAreaRedraw = (viewport: RefObject<PixelViewportHandle | null>): void => {
  useEffect(() => useAreaStore.subscribe(() => viewport.current?.redraw()), [viewport]);
};

export { useAreaRedraw };
