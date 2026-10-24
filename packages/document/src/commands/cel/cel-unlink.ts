/* @layer core @kind logic */
import { addCel } from '../../draft/add-cel';
import { setCelSlot } from '../../draft/set-cel-slot';
import { celUses } from '../../read/cel-uses';
import { requireSprite } from '../../read/require-sprite';
import { celUnlinkSchema } from '../../schema/cel-unlink-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';

const celUnlink = defineCommand({
  name: COMMAND_NAME.celUnlink,
  scope: 'cels',
  linked: 'allow',
  schema: celUnlinkSchema,
  run: (draft, input) => {
    for (const target of input.cels) {
      const sprite = requireSprite(draft.artwork, target.spriteId);
      const source = target.celId ? sprite.cels[target.celId] : undefined;
      if (source && celUses(sprite, source.id).length > 1) {
        setCelSlot(draft, target, addCel(draft, sprite.id, source.pixels.slice()));
      }
    }
  },
});

export { celUnlink };
