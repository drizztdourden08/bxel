/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { currentSelection } from './current-selection';
import type { AnimationFocus } from './timeline.type';

const menuFrames = (focus: AnimationFocus, selection: ReadonlySet<string> | undefined): readonly AnimFrameId[] => {
  const ids = focus.animation.frames.map((frame) => frame.id).filter((id) => selection?.has(id) === true);
  return ids.length > 0 ? ids : currentSelection(focus);
};

export { menuFrames };
