/* @layer core @kind logic */
import { updateAnimation } from '../../draft/update-animation';
import { animationTagUpdateSchema } from '../../schema/animation-tag-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { patchMirrorTag } from './patch-mirror-tag';
import { patchSpanTag } from './patch-span-tag';
import { pickAnimTag } from './pick-anim-tag';
import { pickAnimation } from './pick-animation';

const animationTagUpdate = defineCommand({
  name: COMMAND_NAME.animationTagUpdate,
  scope: 'none',
  schema: animationTagUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const animation = pickAnimation(draft, options.animation);
    const tag = pickAnimTag(animation, options.tag, 'options.tag');
    const next = tag.kind === 'span' ? patchSpanTag(animation, tag, options) : patchMirrorTag(animation, tag, options);
    updateAnimation(draft, animation.id, (current) => ({
      ...current,
      tags: current.tags.map((item) => (item.id === tag.id ? next : item)),
    }));
  },
});

export { animationTagUpdate };
