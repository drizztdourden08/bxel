/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import { gradientOriginHit } from '../../../editor/gradient-origin-hit';
import { gradientOriginShown } from '../../../editor/gradient-origin-shown';
import { moveGradientOrigin } from '../../../editor/move-gradient-origin';
import { PRIMARY_BUTTON } from '../../../editor/tools.constants';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { SelectGesture } from './canvas-tools.type';

const useGradientOriginDrag = (viewport: RefObject<PixelViewportHandle | null>): SelectGesture => {
  const held = useRef(false);
  const rawAt = (event: { clientX: number; clientY: number }) => viewport.current?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 };
  return {
    down: (event) => {
      const handle = viewport.current;
      if (!handle || event.button !== PRIMARY_BUTTON || !gradientOriginShown()) return false;
      const { gradientOriginX, gradientOriginY } = useDrawingStore.getState();
      if (!gradientOriginHit({ x: gradientOriginX, y: gradientOriginY }, rawAt(event), handle.view().zoom)) return false;
      held.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      return true;
    },
    move: (event) => {
      if (!held.current) return false;
      moveGradientOrigin(rawAt(event));
      return true;
    },
    up: () => {
      if (!held.current) return false;
      held.current = false;
      return true;
    },
  };
};

export { useGradientOriginDrag };
