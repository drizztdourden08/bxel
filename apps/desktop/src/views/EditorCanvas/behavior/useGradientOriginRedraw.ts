/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const useGradientOriginRedraw = (viewport: RefObject<PixelViewportHandle | null>): void => {
  useEffect(() => {
    const redraw = () => viewport.current?.redraw();
    const drawing = useDrawingStore.subscribe(redraw);
    const tools = useToolStore.subscribe(redraw);
    return () => {
      drawing();
      tools();
    };
  }, [viewport]);
};

export { useGradientOriginRedraw };
