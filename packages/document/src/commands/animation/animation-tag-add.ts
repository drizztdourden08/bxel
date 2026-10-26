/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateAnimation } from '../../draft/update-animation';
import { animationTagAddSchema } from '../../schema/animation-tag-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { buildMirrorTag } from './build-mirror-tag';
import { buildSpanTag } from './build-span-tag';
import { pickAnimation } from './pick-animation';

const animationTagAdd = defineCommand({
  name: COMMAND_NAME.animationTagAdd,
  scope: 'none',
  schema: animationTagAddSchema,
  run: (draft, input) => {
    const { options } = input;
    const animation = pickAnimation(draft, options.animation);
    const tag =
      options.kind === 'span' ? buildSpanTag(draft.ids, animation, options) : buildMirrorTag(draft.ids, animation, options);
    updateAnimation(draft, animation.id, (current) => ({ ...current, tags: [...current.tags, tag] }));
    registerRef(draft, input.ref, tag.id);
  },
});

export { animationTagAdd };
