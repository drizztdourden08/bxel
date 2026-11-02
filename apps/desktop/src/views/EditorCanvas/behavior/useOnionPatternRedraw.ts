/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useOnionPatternStore } from '../../../stores/useOnionPatternStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const useOnionPatternRedraw = (viewport: RefObject<PixelViewportHandle | null>): void => {
  useEffect(() => useOnionPatternStore.subscribe(() => viewport.current?.redraw()), [viewport]);
};

export { useOnionPatternRedraw };
