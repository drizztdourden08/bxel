/* @layer renderer-app @kind hook */
import { layout, useFocusMode } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { useViewStore } from '../../../stores/useViewStore';

const useFullscreenFocus = (open: boolean): void => {
  const focused = useFocusMode();
  const was = useRef(false);
  useEffect(() => {
    if (!open) return undefined;
    const already = layout.isFocusMode();
    layout.focusMode(true);
    return () => {
      if (!already) layout.focusMode(false);
    };
  }, [open]);
  useEffect(() => {
    if (open && was.current && !focused) useViewStore.getState().setToggles({ fullscreen: false });
    was.current = focused;
  }, [open, focused]);
};

export { useFullscreenFocus };
