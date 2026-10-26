/* @layer core @kind logic */
import { orderAnimTags } from '../../draft/order-anim-tags';
import { updateAnimation } from '../../draft/update-animation';
import { animationFrameReorderSchema } from '../../schema/animation-frame-reorder-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickAnimFrame } from './pick-anim-frame';
import { pickAnimation } from './pick-animation';

const animationFrameReorder = defineCommand({
  name: COMMAND_NAME.animationFrameReorder,
  scope: 'none',
  schema: animationFrameReorderSchema,
  run: (draft, input) => {
    const { to } = input.options;
    const animation = pickAnimation(draft, input.options.animation);
    const { frame, index } = pickAnimFrame(animation, input.options.frame, 'options.frame');
    if (to >= animation.frames.length) {
      throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, 'The position is at or above the number of frames.', { path: 'options.to' });
    }
    if (index === to) return;
    updateAnimation(draft, animation.id, (current) => {
      const rest = current.frames.filter((item) => item.id !== frame.id);
      const frames = [...rest.slice(0, to), frame, ...rest.slice(to)];
      return { ...current, frames, tags: orderAnimTags(current.tags, frames) };
    });
  },
});

export { animationFrameReorder };
