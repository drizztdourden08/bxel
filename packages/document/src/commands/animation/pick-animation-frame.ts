/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimationFramePickOptions } from '../../schema/animation-options.type';
import type { PickedAnimationFrame } from './anim.type';
import { pickAnimFrame } from './pick-anim-frame';
import { pickAnimation } from './pick-animation';

const pickAnimationFrame = (draft: Draft, options: AnimationFramePickOptions): PickedAnimationFrame => {
  const animation = pickAnimation(draft, options.animation);
  return { animation, frame: pickAnimFrame(animation, options.frame, 'options.frame').frame };
};

export { pickAnimationFrame };
