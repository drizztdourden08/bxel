/* @layer core @kind logic */
import { updateSprite } from '../../draft/update-sprite';
import type { TagId } from '../../model/ids.type';
import type { Tag } from '../../model/sprite.type';
import { tagAddSchema } from '../../schema/tag-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickFrames } from '../frame/pick-frames';
import { registerCreatedRef } from '../register-created-ref';
import { checkSpan } from './check-span';
import { tagName } from './tag-name';

const tagAdd = defineCommand({
  name: COMMAND_NAME.tagAdd,
  scope: 'sprites',
  schema: tagAddSchema,
  run: (draft, input) => {
    const { name, from, to, direction, repeat } = input.options;
    const starts = pickFrames(draft.artwork, input.sprites, from, 'options.from');
    const ends = pickFrames(draft.artwork, input.sprites, to, 'options.to');
    const created: TagId[] = [];
    for (const [index, start] of starts.entries()) {
      const end = ends[index];
      if (!end) continue;
      const { sprite } = start;
      checkSpan(sprite, start.frame.id, end.frame.id);
      const tag: Tag = {
        id: draft.ids.next('tag') as TagId,
        name: tagName(
          name,
          sprite.tags.map((item) => item.name),
        ),
        from: start.frame.id,
        to: end.frame.id,
        direction,
        repeat,
      };
      updateSprite(draft, sprite.id, (current) => ({ ...current, tags: [...current.tags, tag] }));
      created.push(tag.id);
    }
    registerCreatedRef(draft, input, created, 'tag');
  },
});

export { tagAdd };
