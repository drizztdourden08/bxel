/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import type { KeyboardEventHandler } from 'react';
import { keyAction } from '../../../editor/key-action';
import { runAction } from '../../../editor/run-action';

const useEditorKeys = (): KeyboardEventHandler<HTMLElement> =>
  useCallback((event) => {
    const action = keyAction(event);
    if (!action) return;
    event.preventDefault();
    runAction(action);
  }, []);

export { useEditorKeys };
