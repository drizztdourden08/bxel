/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import { beginGuide } from '../../../guides/begin-guide';
import { dragGuide } from '../../../guides/drag-guide';
import { dropGuide } from '../../../guides/drop-guide';
import { guideNear } from '../../../guides/guide-near';
import { guideScope } from '../../../guides/guide-scope';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { AxisDrag } from './canvas-tools.type';

const useGuideGrab = (viewport: RefObject<PixelViewportHandle | null>): AxisDrag => {
  const held = useRef(false);
  return {
    down: (event) => {
      const handle = viewport.current;
      const scope = guideScope();
      const size = scope?.size();
      if (event.button !== 0 || !handle || !scope || !size || !useViewStore.getState().guides) return false;
      const hit = guideNear(handle, { ...size, guides: scope.lines() }, event);
      if (!hit || !beginGuide(hit.axis, hit.position)) return false;
      held.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      return true;
    },
    move: (event) => {
      if (!held.current) return false;
      dragGuide(event, event.shiftKey);
      return true;
    },
    up: () => {
      if (!held.current) return false;
      held.current = false;
      dropGuide();
      return true;
    },
  };
};

export { useGuideGrab };
