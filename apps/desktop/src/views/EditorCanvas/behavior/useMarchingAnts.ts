/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { usePendingStore } from '../../../stores/usePendingStore';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { ANT_STEP_MS, REDUCED_MOTION } from '../EditorCanvas.constants';

const hasOutline = (): boolean => {
  const { mask, draft } = useSelectionStore.getState();
  return mask !== null || draft !== null || usePendingStore.getState().pending !== null;
};

const useMarchingAnts = (viewport: RefObject<PixelViewportHandle | null>): void => {
  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);
    let timer: number | undefined;
    const sync = (): void => {
      window.clearInterval(timer);
      timer = undefined;
      viewport.current?.redraw();
      if (!media.matches && hasOutline()) timer = window.setInterval(() => viewport.current?.redraw(), ANT_STEP_MS);
    };
    sync();
    const stops = [useSelectionStore.subscribe(sync), usePendingStore.subscribe(sync)];
    media.addEventListener('change', sync);
    return () => {
      window.clearInterval(timer);
      media.removeEventListener('change', sync);
      for (const stop of stops) stop();
    };
  }, [viewport]);
};

export { useMarchingAnts };
