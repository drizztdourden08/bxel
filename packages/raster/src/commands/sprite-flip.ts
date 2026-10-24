/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { FLIP_ORIENTATION } from '../transform/transform.constants';
import { flipSprite } from './flip-sprite';
import { spriteFlipSchema } from './schema/sprite-flip-schema';
import { TRANSFORM_COMMAND } from './transform-commands.constants';

const spriteFlip = defineCommand({
  name: TRANSFORM_COMMAND.spriteFlip,
  scope: 'cels',
  schema: spriteFlipSchema,
  run: (draft, input) => {
    const orientation = FLIP_ORIENTATION[input.options.axis];
    for (const spriteId of input.sprites) {
      flipSprite(draft, spriteId, input.cels.filter((cel) => cel.spriteId === spriteId), orientation);
    }
  },
});

export { spriteFlip };
