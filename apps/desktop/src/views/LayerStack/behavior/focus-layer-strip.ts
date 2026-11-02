/* @layer renderer-app @kind logic */
import { STRIP_ROOT, STRIP_TARGET } from '../LayerStack.constants';

const focusLayerStrip = (): void => {
  requestAnimationFrame(() => document.querySelector<HTMLElement>(`${STRIP_ROOT} ${STRIP_TARGET}`)?.focus());
};

export { focusLayerStrip };
