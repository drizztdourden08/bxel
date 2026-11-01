/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { dropOrphanFrames } from '../../draft/drop-orphan-frames';
import { updateAnimation } from '../../draft/update-animation';
import { animationFrameUpdateSchema } from '../../schema/animation-frame-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { patchAnimFrame } from './patch-anim-frame';
import { pickAnimFrames } from './pick-anim-frames';
import { pickAnimation } from './pick-animation';

const animationFrameUpdate = defineCommand({
  name: COMMAND_NAME.animationFrameUpdate,
  scope: 'none',
  schema: animationFrameUpdateSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const next = new Map(pickAnimFrames(animation, input.options).map((frame) => [frame.id, patchAnimFrame(draft, animation, frame, input.options)]));
    updateAnimation(draft, animation.id, (current) => ({
      ...current,
      frames: current.frames.map((item) => next.get(item.id) ?? item),
    }));
    addReport(draft, 'sprites', dropOrphanFrames(draft));
  },
});

export { animationFrameUpdate };
