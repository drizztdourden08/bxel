/* @layer core @kind logic */
import { updateSprite } from '../../draft/update-sprite';
import { tagDeleteSchema } from '../../schema/tag-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickTags } from './pick-tags';

const tagDelete = defineCommand({
  name: COMMAND_NAME.tagDelete,
  scope: 'sprites',
  schema: tagDeleteSchema,
  run: (draft, input) => {
    for (const { sprite, tag } of pickTags(draft.artwork, input.sprites, input.options.tag)) {
      updateSprite(draft, sprite.id, (current) => ({
        ...current,
        tags: current.tags.filter((item) => item.id !== tag.id),
      }));
    }
  },
});

export { tagDelete };
