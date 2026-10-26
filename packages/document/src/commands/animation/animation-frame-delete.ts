/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { detachTileTags } from '../../draft/detach-tile-tags';
import { dropOrphanFrames } from '../../draft/drop-orphan-frames';
import { shrinkAnimTags } from '../../draft/shrink-anim-tags';
import { updateAnimation } from '../../draft/update-animation';
import { animationFrameDeleteSchema } from '../../schema/animation-frame-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickAnimFrame } from './pick-anim-frame';
import { pickAnimation } from './pick-animation';

const animationFrameDelete = defineCommand({
  name: COMMAND_NAME.animationFrameDelete,
  scope: 'none',
  schema: animationFrameDeleteSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const gone = new Set(input.options.frames.map((ref, index) => pickAnimFrame(animation, ref, `options.frames.${index}`).frame.id));
    if (gone.size >= animation.frames.length) {
      throw fail(ERROR_CODE.LAST_FRAME, `Animation "${animation.name}" keeps at least one frame.`, { path: 'options.frames' });
    }
    const shrunk = shrinkAnimTags(animation.tags, animation.frames, gone);
    updateAnimation(draft, animation.id, (current) => ({
      ...current,
      frames: current.frames.filter((frame) => !gone.has(frame.id)),
      tags: shrunk.tags,
    }));
    detachTileTags(draft, animation.id, new Set(shrunk.removed));
    addReport(draft, 'frames', gone.size);
    addReport(draft, 'sprites', dropOrphanFrames(draft));
  },
});

export { animationFrameDelete };
