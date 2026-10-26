/* @layer renderer-app @kind logic */
import { openExport } from '../export/open-export';
import { currentFocus } from './current-focus';

const exportFrames = (): void => {
  const focus = currentFocus();
  if (focus) openExport('frames', { animationId: focus.animation.id });
};

export { exportFrames };
