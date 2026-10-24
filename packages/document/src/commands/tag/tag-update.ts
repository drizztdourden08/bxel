/* @layer core @kind logic */
import { updateSprite } from '../../draft/update-sprite';
import type { Tag } from '../../model/sprite.type';
import { tagUpdateSchema } from '../../schema/tag-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkSpan } from './check-span';
import { pickTags } from './pick-tags';
import { resolveFrameId } from './resolve-frame-id';
import { sameTag } from './same-tag';
import { tagName } from './tag-name';

const tagUpdate = defineCommand({
  name: COMMAND_NAME.tagUpdate,
  scope: 'sprites',
  schema: tagUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    for (const { sprite, tag } of pickTags(draft.artwork, input.sprites, options.tag)) {
      const others = sprite.tags.filter((item) => item.id !== tag.id).map((item) => item.name);
      const next: Tag = {
        ...tag,
        name: options.name === undefined ? tag.name : tagName(options.name, others),
        from: resolveFrameId({ artwork: draft.artwork, spriteId: sprite.id, ref: options.from, path: 'options.from', fallback: tag.from }),
        to: resolveFrameId({ artwork: draft.artwork, spriteId: sprite.id, ref: options.to, path: 'options.to', fallback: tag.to }),
        direction: options.direction ?? tag.direction,
        repeat: options.repeat ?? tag.repeat,
      };
      checkSpan(sprite, next.from, next.to);
      if (!sameTag(next, tag)) {
        updateSprite(draft, sprite.id, (current) => ({
          ...current,
          tags: current.tags.map((item) => (item.id === tag.id ? next : item)),
        }));
      }
    }
  },
});

export { tagUpdate };
