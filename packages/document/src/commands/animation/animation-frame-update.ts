/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { dropOrphanFrames } from '../../draft/drop-orphan-frames';
import { updateAnimation } from '../../draft/update-animation';
import { animationFrameUpdateSchema } from '../../schema/animation-frame-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { patchAnimFrame } from './patch-anim-frame';
import { pickAnimFrame } from './pick-anim-frame';
import { pickAnimation } from './pick-animation';

const animationFrameUpdate = defineCommand({
  name: COMMAND_NAME.animationFrameUpdate,
  scope: 'none',
  schema: animationFrameUpdateSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const { frame } = pickAnimFrame(animation, input.options.frame, 'options.frame');
    const next = patchAnimFrame(draft, animation, frame, input.options);
    updateAnimation(draft, animation.id, (current) => ({
      ...current,
      frames: current.frames.map((item) => (item.id === frame.id ? next : item)),
    }));
    addReport(draft, 'sprites', dropOrphanFrames(draft));
  },
});

export { animationFrameUpdate };
