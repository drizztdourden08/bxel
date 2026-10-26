/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { updateAnimation } from '../../draft/update-animation';
import { MAX_ANIMATION_FRAMES } from '../../model/animation.constants';
import { animationFrameAddSchema } from '../../schema/animation-frame-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { registerCreatedRef } from '../register-created-ref';
import { newFrames } from './new-frames';
import { pickAnimation } from './pick-animation';

const animationFrameAdd = defineCommand({
  name: COMMAND_NAME.animationFrameAdd,
  scope: 'none',
  schema: animationFrameAddSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const frames = newFrames(draft, animation, input.options);
    const at = input.options.at ?? animation.frames.length;
    if (at > animation.frames.length) {
      throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, `The position is past the ${animation.frames.length} frames.`, { path: 'options.at' });
    }
    if (animation.frames.length + frames.length > MAX_ANIMATION_FRAMES) {
      throw fail(ERROR_CODE.LIMIT_REACHED, `An animation holds up to ${MAX_ANIMATION_FRAMES} frames.`);
    }
    updateAnimation(draft, animation.id, (current) => ({
      ...current,
      frames: [...current.frames.slice(0, at), ...frames, ...current.frames.slice(at)],
    }));
    addReport(draft, 'frames', frames.length);
    registerCreatedRef(
      draft,
      input,
      frames.map((frame) => frame.id),
      'frame',
    );
  },
});

export { animationFrameAdd };
