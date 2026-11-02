/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import { beginGuide } from '../../../guides/begin-guide';
import { doubleGuide } from '../../../guides/double-guide';
import { dragGuide } from '../../../guides/drag-guide';
import { editGuide } from '../../../guides/edit-guide';
import { dropGuide } from '../../../guides/drop-guide';
import { guideNear } from '../../../guides/guide-near';
import { guideScope } from '../../../guides/guide-scope';
import type { LastGuideHit } from '../../../guides/guide.type';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { AxisDrag } from './canvas-tools.type';

const useGuideGrab = (viewport: RefObject<PixelViewportHandle | null>): AxisDrag => {
  const held = useRef(false);
  const last = useRef<LastGuideHit | null>(null);
  return {
    down: (event) => {
      const handle = viewport.current;
      const scope = guideScope();
      const size = scope?.size();
      if (event.button !== 0 || !handle || !scope || !size || !useViewStore.getState().guides) return false;
      const hit = guideNear(handle, { ...size, guides: scope.lines() }, event);
      if (!hit) return false;
      if (doubleGuide(last.current, hit, event.timeStamp)) {
        last.current = null;
        editGuide(hit);
        return true;
      }
      if (!beginGuide(hit.axis, hit.position)) return false;
      last.current = { ...hit, at: event.timeStamp };
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
