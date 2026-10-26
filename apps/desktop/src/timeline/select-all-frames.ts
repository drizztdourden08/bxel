/* @layer renderer-app @kind logic */
import { currentFocus } from './current-focus';
import { selectFrameIds } from './select-frame-ids';

const selectAllFrames = (): void => {
  const focus = currentFocus();
  if (focus) selectFrameIds(focus.animation.frames.map((frame) => frame.id), focus.frame.id);
};

export { selectAllFrames };
