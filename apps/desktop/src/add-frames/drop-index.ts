/* @layer renderer-app @kind logic */
import { FRAME_SELECTOR } from './drop-index.constants';
import type { AnimationFocus } from '../timeline/timeline.type';

const dropIndex = (target: EventTarget, pointerX: number, focus: AnimationFocus): number => {
  const cell = target instanceof Element ? target.closest<HTMLElement>(FRAME_SELECTOR) : null;
  const index = focus.animation.frames.findIndex((frame) => frame.id === cell?.dataset.frameId);
  if (!cell || index < 0) return focus.animation.frames.length;
  const box = cell.getBoundingClientRect();
  return pointerX > box.left + box.width / 2 ? index + 1 : index;
};

export { dropIndex };
