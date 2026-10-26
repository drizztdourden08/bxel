/* @layer renderer-app @kind logic */
import { currentFocus } from './current-focus';
import { goToFrame } from './go-to-frame';

const jumpFrame = (end: 'first' | 'last', extend = false): void => {
  const focus = currentFocus();
  const frame = end === 'first' ? focus?.animation.frames[0] : focus?.animation.frames.at(-1);
  if (frame) goToFrame(frame.id, extend);
};

export { jumpFrame };
