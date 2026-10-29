/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { pathDraft } from '../../../editor/path-draft';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { cancelGesture } from './cancel-gesture';
import type { PaintGesture } from './canvas-tools.type';
import { clearGesture } from './clear-gesture';
import { finishGesture } from './finish-gesture';
import { gestureLive } from './gesture-live';
import { pressDown } from './press-down';
import { pressMove } from './press-move';
import { pressUp } from './press-up';
import { redrawGesture } from './redraw-gesture';
import { useDraftKeys } from './useDraftKeys';

const usePaintGesture = (viewport: RefObject<PixelViewportHandle | null>): PaintGesture => {
  const [live, setLive] = useState<ImageData | null>(null);
  useEffect(() => {
    gestureLive.show = setLive;
    gestureLive.redraw = () => viewport.current?.redraw();
    return clearGesture;
  }, [viewport]);
  useDraftKeys({ finish: finishGesture, cancel: cancelGesture, redraw: redrawGesture });
  useEffect(
    () =>
      useToolStore.subscribe((state, previous) => {
        if (state.tool !== previous.tool && pathDraft.current) cancelGesture();
      }),
    [],
  );
  return {
    live,
    down: (event) => pressDown(viewport.current, event),
    move: (event) => pressMove(viewport.current, event),
    up: pressUp,
  };
};

export { usePaintGesture };
