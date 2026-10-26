/* @layer core @kind logic */
import { detachTileTags } from '../../draft/detach-tile-tags';
import { updateAnimation } from '../../draft/update-animation';
import { animationTagDeleteSchema } from '../../schema/animation-tag-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickAnimTag } from './pick-anim-tag';
import { pickAnimation } from './pick-animation';

const animationTagDelete = defineCommand({
  name: COMMAND_NAME.animationTagDelete,
  scope: 'none',
  schema: animationTagDeleteSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const tag = pickAnimTag(animation, input.options.tag, 'options.tag');
    const gone = new Set([tag.id, ...animation.tags.flatMap((item) => (item.kind === 'mirror' && item.of === tag.id ? [item.id] : []))]);
    updateAnimation(draft, animation.id, (current) => ({ ...current, tags: current.tags.filter((item) => !gone.has(item.id)) }));
    detachTileTags(draft, animation.id, gone);
  },
});

export { animationTagDelete };
