/* @layer core @kind logic */
import { addAnimation } from '../../draft/add-animation';
import { registerRef } from '../../draft/register-ref';
import type { Animation } from '../../model/animation.type';
import type { AnimationId } from '../../model/ids.type';
import { animationDuplicateSchema } from '../../schema/animation-duplicate-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { freeName } from '../layer/free-name';
import { COPY_SUFFIX } from '../layer/layer.constants';
import { copyAnimationContent } from './copy-animation-content';
import { pickAnimation } from './pick-animation';

const animationDuplicate = defineCommand({
  name: COMMAND_NAME.animationDuplicate,
  scope: 'none',
  schema: animationDuplicateSchema,
  run: (draft, input) => {
    const source = pickAnimation(draft, input.options.animation);
    const taken = draft.artwork.animations.map((animation) => animation.name);
    const name = input.options.name === undefined ? freeName(taken, `${source.name}${COPY_SUFFIX}`) : checkName(input.options.name);
    assertNameFree(taken, name);
    const copy: Animation = {
      ...source,
      id: draft.ids.next('anm') as AnimationId,
      name,
      created: draft.stamp,
      ...copyAnimationContent(draft, source, name),
    };
    addAnimation(draft, copy);
    registerRef(draft, input.ref, copy.id);
  },
});

export { animationDuplicate };
