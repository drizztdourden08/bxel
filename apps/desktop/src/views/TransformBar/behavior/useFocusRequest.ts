/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useTransformUiStore } from '../../../stores/useTransformUiStore';
import { fieldId } from './field-id';

const useFocusRequest = (shown: boolean): void => {
  const focus = useTransformUiStore((state) => state.focus);
  const setFocus = useTransformUiStore((state) => state.setFocus);
  useEffect(() => {
    if (!shown || focus === null) return;
    const input = document.getElementById(fieldId(focus));
    input?.focus();
    if (input instanceof HTMLInputElement) input.select();
    setFocus(null);
  }, [shown, focus, setFocus]);
};

export { useFocusRequest };
