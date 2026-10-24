/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const useViewportBridge = (viewport: RefObject<PixelViewportHandle | null>, ready: boolean): void => {
  useEffect(() => {
    if (!ready) return undefined;
    const { setViewport } = useViewStore.getState();
    setViewport(viewport.current);
    return () => setViewport(null);
  }, [viewport, ready]);
};

export { useViewportBridge };
