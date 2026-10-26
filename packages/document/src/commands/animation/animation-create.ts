/* @layer core @kind logic */
import { addAnimation } from '../../draft/add-animation';
import { registerRef } from '../../draft/register-ref';
import type { Animation } from '../../model/animation.type';
import { DEFAULT_ANIM_LOOP, DEFAULT_DIRECTION_PATTERN } from '../../model/animation.constants';
import type { AnimationId } from '../../model/ids.type';
import { animationCreateSchema } from '../../schema/animation-create-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { checkSize } from '../../validate/check-size';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { planAnimation } from './plan-animation';

const animationCreate = defineCommand({
  name: COMMAND_NAME.animationCreate,
  scope: 'none',
  schema: animationCreateSchema,
  run: (draft, input) => {
    const { options } = input;
    const name = checkName(options.name);
    assertNameFree(
      draft.artwork.animations.map((animation) => animation.name),
      name,
    );
    const plan = planAnimation(draft, name, options.source);
    checkSize(plan);
    const animation: Animation = {
      id: draft.ids.next('anm') as AnimationId,
      name,
      created: draft.stamp,
      bankId: plan.bankId,
      width: plan.width,
      height: plan.height,
      anchor: options.anchor ?? { x2: plan.width, y2: plan.height },
      loop: DEFAULT_ANIM_LOOP,
      directions: 'none',
      directionPattern: DEFAULT_DIRECTION_PATTERN,
      frames: plan.frames,
      tags: [],
    };
    addAnimation(draft, animation);
    registerRef(draft, input.ref, animation.id);
  },
});

export { animationCreate };
