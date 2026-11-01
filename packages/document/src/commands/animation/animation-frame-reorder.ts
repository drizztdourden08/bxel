/* @layer core @kind logic */
import { orderAnimTags } from '../../draft/order-anim-tags';
import { updateAnimation } from '../../draft/update-animation';
import { animationFrameReorderSchema } from '../../schema/animation-frame-reorder-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickAnimFrames } from './pick-anim-frames';
import { pickAnimation } from './pick-animation';

const animationFrameReorder = defineCommand({
  name: COMMAND_NAME.animationFrameReorder,
  scope: 'none',
  schema: animationFrameReorderSchema,
  run: (draft, input) => {
    const { to } = input.options;
    const animation = pickAnimation(draft, input.options.animation);
    const block = pickAnimFrames(animation, input.options);
    if (to + block.length > animation.frames.length) {
      throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, 'The position is at or above the number of frames.', { path: 'options.to' });
    }
    const moving = new Set(block.map((frame) => frame.id));
    const rest = animation.frames.filter((item) => !moving.has(item.id));
    const frames = [...rest.slice(0, to), ...block, ...rest.slice(to)];
    if (frames.every((frame, index) => frame.id === animation.frames[index]?.id)) return;
    updateAnimation(draft, animation.id, (current) => ({ ...current, frames, tags: orderAnimTags(current.tags, frames) }));
  },
});

export { animationFrameReorder };
