/* @layer core @kind logic */
import { animationFrameReverseSchema } from '../../schema/animation-frame-reverse-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { applyFrameOrder } from './apply-frame-order';
import { pickAnimFrames } from './pick-anim-frames';
import { pickAnimation } from './pick-animation';

const animationFrameReverse = defineCommand({
  name: COMMAND_NAME.animationFrameReverse,
  scope: 'none',
  schema: animationFrameReverseSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const picked = input.options.frames === undefined ? animation.frames : pickAnimFrames(animation, { frames: input.options.frames });
    const ids = new Set(picked.map((frame) => frame.id));
    const places = animation.frames.filter((frame) => ids.has(frame.id));
    const flipped = [...places].reverse();
    let next = 0;
    applyFrameOrder(
      draft,
      animation,
      animation.frames.map((frame) => (ids.has(frame.id) ? (flipped[next++] ?? frame) : frame)),
    );
  },
});

export { animationFrameReverse };
