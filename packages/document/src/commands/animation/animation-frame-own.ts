/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { updateAnimation } from '../../draft/update-animation';
import { findSprite } from '../../read/find-sprite';
import { animationFramePickSchema } from '../../schema/animation-frame-pick-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ownedBlank } from './owned-blank';
import { ownedCopy } from './owned-copy';
import { pickAnimFrame } from './pick-anim-frame';
import { pickAnimation } from './pick-animation';

const animationFrameOwn = defineCommand({
  name: COMMAND_NAME.animationFrameOwn,
  scope: 'none',
  schema: animationFramePickSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const { frame } = pickAnimFrame(animation, input.options.frame, 'options.frame');
    const source = frame.spriteId === null ? undefined : findSprite(draft.artwork, frame.spriteId);
    if (source?.role === 'frame') return;
    const owned = source
      ? ownedCopy(draft, animation.name, source)
      : ownedBlank(draft, animation.name, animation, animation.bankId);
    updateAnimation(draft, animation.id, (current) => ({
      ...current,
      frames: current.frames.map((item) => (item.id === frame.id ? { ...item, spriteId: owned.id } : item)),
    }));
    addReport(draft, 'sprites', 1);
  },
});

export { animationFrameOwn };
