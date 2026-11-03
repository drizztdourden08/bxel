/* @layer renderer-app @kind logic */
import { usePendingStore } from '../../stores/usePendingStore';
import { useTransformUiStore } from '../../stores/useTransformUiStore';

const setMirror = (on: boolean): void => {
  useTransformUiStore.getState().setMirror(on);
  const pending = usePendingStore.getState().pending;
  if (pending) usePendingStore.getState().revise(pending.spec);
};

export { setMirror };
