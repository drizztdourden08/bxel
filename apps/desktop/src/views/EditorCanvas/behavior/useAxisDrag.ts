/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import { currentTarget } from '../../../editor/current-target';
import type { SymmetryAxis } from '../../../stores/tool-store.type';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { axisGrip } from './axis-grip';
import { axisPosition } from './axis-position';
import type { AxisDrag } from './canvas-tools.type';

const useAxisDrag = (viewport: RefObject<PixelViewportHandle | null>): AxisDrag => {
  const held = useRef<SymmetryAxis | null>(null);
  return {
    down: (event) => {
      const handle = viewport.current;
      const target = currentTarget();
      if (!handle || !target) return false;
      const grabbed = axisGrip(handle, useToolStore.getState(), target.sprite, event);
      if (!grabbed) return false;
      held.current = grabbed;
      event.currentTarget.setPointerCapture(event.pointerId);
      return true;
    },
    move: (event) => {
      const axis = held.current;
      const handle = viewport.current;
      const target = currentTarget();
      if (!axis) return false;
      if (handle && target) useToolStore.getState().setAxis(axis, axisPosition(handle, axis, target.sprite, event));
      return true;
    },
    up: () => {
      const dragging = held.current !== null;
      held.current = null;
      return dragging;
    },
  };
};

export { useAxisDrag };
