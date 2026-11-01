/* @layer core @kind logic */
import { orderAnimTags } from '../../draft/order-anim-tags';
import { updateAnimation } from '../../draft/update-animation';
import { animationFrameReverseSchema } from '../../schema/animation-frame-reverse-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
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
    const frames = animation.frames.map((frame) => (ids.has(frame.id) ? (flipped[next++] ?? frame) : frame));
    if (frames.every((frame, index) => frame.id === animation.frames[index]?.id)) return;
    updateAnimation(draft, animation.id, (current) => ({ ...current, frames, tags: orderAnimTags(current.tags, frames) }));
  },
});

export { animationFrameReverse };
