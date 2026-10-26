/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { dropOrphanFrames } from '../../draft/drop-orphan-frames';
import { updateAnimation } from '../../draft/update-animation';
import { animationDirectionsSchema } from '../../schema/animation-directions-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { isBlankFrame } from './is-blank-frame';
import { pickAnimation } from './pick-animation';
import { scaffoldDirections } from './scaffold-directions';

const animationDirections = defineCommand({
  name: COMMAND_NAME.animationDirections,
  scope: 'none',
  schema: animationDirectionsSchema,
  run: (draft, input) => {
    const { options } = input;
    const animation = pickAnimation(draft, options.animation);
    const scaffold = scaffoldDirections(draft, options);
    const [only] = animation.frames;
    const pristine = animation.frames.length === 1 && only !== undefined && isBlankFrame(draft.artwork, only) && animation.tags.length === 0;
    updateAnimation(draft, animation.id, (current) => ({
      ...current,
      directions: options.mode,
      directionPattern: options.pattern ?? current.directionPattern,
      frames: [...(pristine ? [] : current.frames), ...scaffold.frames],
      tags: [...(pristine ? [] : current.tags), ...scaffold.tags],
    }));
    if (pristine) dropOrphanFrames(draft);
    addReport(draft, 'frames', scaffold.frames.length);
    addReport(draft, 'tags', scaffold.tags.length);
  },
});

export { animationDirections };
