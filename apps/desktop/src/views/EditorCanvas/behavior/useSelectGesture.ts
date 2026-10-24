/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { PRIMARY_BUTTON } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { beginFloatDrag } from './begin-float-drag';
import { beginSelectDrag } from './begin-select-drag';
import type { ActiveDrag, SelectGesture } from './canvas-tools.type';
import { finishDrag } from './finish-drag';
import { updateDrag } from './update-drag';

const useSelectGesture = (viewport: RefObject<PixelViewportHandle | null>): SelectGesture => {
  const drag = useRef<ActiveDrag | null>(null);
  return {
    down: (event) => {
      const { tool } = useToolStore.getState();
      if (event.button !== PRIMARY_BUTTON || (tool !== 'select' && tool !== 'move') || !currentTarget()) return false;
      const started = tool === 'move' ? beginFloatDrag(viewport.current, event) : beginSelectDrag(viewport.current, event);
      drag.current = started;
      if (started) event.currentTarget.setPointerCapture(event.pointerId);
      return true;
    },
    move: (event) => {
      if (!drag.current) return false;
      updateDrag(drag.current, viewport.current, event);
      viewport.current?.redraw();
      return true;
    },
    up: () => {
      const active = drag.current;
      drag.current = null;
      if (active) finishDrag(active);
      return active !== null;
    },
  };
};

export { useSelectGesture };
