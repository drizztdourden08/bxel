/* @layer core @kind logic */
import { orderAnimTags } from '../../draft/order-anim-tags';
import type { Draft } from '../../draft/draft.type';
import { updateAnimation } from '../../draft/update-animation';
import type { AnimFrame, Animation } from '../../model/animation.type';

const applyFrameOrder = (draft: Draft, animation: Animation, frames: readonly AnimFrame[]): void => {
  if (frames.every((frame, index) => frame.id === animation.frames[index]?.id)) return;
  updateAnimation(draft, animation.id, (current) => ({ ...current, frames, tags: orderAnimTags(current.tags, frames) }));
};

export { applyFrameOrder };
