/* @layer renderer-app @kind logic */
import { currentFocus } from './current-focus';
import type { AnimationFocus } from './timeline.type';

const placedFocus = (): AnimationFocus | null => {
  const focus = currentFocus();
  const spriteId = focus?.frame.spriteId;
  return spriteId === undefined || spriteId === null ? null : focus;
};

export { placedFocus };
