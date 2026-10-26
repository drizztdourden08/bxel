/* @layer core @kind logic */
import { updateAnimation } from '../../draft/update-animation';
import { animationUpdateSchema } from '../../schema/animation-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { patchAnimation } from './patch-animation';
import { pickAnimation } from './pick-animation';

const animationUpdate = defineCommand({
  name: COMMAND_NAME.animationUpdate,
  scope: 'none',
  schema: animationUpdateSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const next = patchAnimation(draft, animation, input.options);
    if (next !== animation) updateAnimation(draft, animation.id, () => next);
  },
});

export { animationUpdate };
