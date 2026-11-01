/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useViewStore } from '../../../stores/useViewStore';

const useAnyKeyClose = (open: boolean): void => {
  useEffect(() => {
    if (!open) return undefined;
    const close = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      useViewStore.getState().setToggles({ fullscreen: false });
    };
    window.addEventListener('keydown', close, true);
    return () => window.removeEventListener('keydown', close, true);
  }, [open]);
};

export { useAnyKeyClose };
