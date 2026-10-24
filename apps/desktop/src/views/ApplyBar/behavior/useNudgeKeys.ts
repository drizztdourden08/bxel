/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { nudgeKey } from '../../../editor/transform/nudge-key';
import { TEXT_FIELDS } from '../ApplyBar.constants';

const useNudgeKeys = (open: boolean): void => {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.target instanceof Element && event.target.closest(TEXT_FIELDS) !== null) return;
      nudgeKey(event);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);
};

export { useNudgeKeys };
