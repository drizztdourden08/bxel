/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import type { FramePick } from './frame-pick.type';

const framePick = (only?: readonly AnimFrameId[]): FramePick | null => {
  const focus = currentFocus();
  if (!focus) return null;
  return { focus, order: focus.animation.frames.map((frame) => frame.id), picked: only ?? currentSelection(focus) };
};

export { framePick };
