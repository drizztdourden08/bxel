/* @layer renderer-app @kind hook */
import type { FocusEvent, RefObject } from 'react';
import { useReadoutStore } from '../stores/useReadoutStore';
import type { CursorRelease } from './cursor-release.type';

const useCursorRelease = (active: RefObject<boolean>, onLeave?: () => void): CursorRelease => ({
  onPointerPixel: () => {
    active.current = false;
  },
  onBlur: (event: FocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    if (active.current) useReadoutStore.getState().setPointer(null);
    active.current = false;
    onLeave?.();
  },
});

export { useCursorRelease };
