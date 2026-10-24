/* @layer core @kind logic */
import { ERROR_CODE, defineCommand, fail, requireSprite } from '@bxel/document';
import { reframeSprite } from './reframe-sprite';
import { spriteTrimSchema } from './schema/sprite-trim-schema';
import { TRANSFORM_COMMAND } from './transform-commands.constants';
import { trimmedFrame } from './trimmed-frame';

const spriteTrim = defineCommand({
  name: TRANSFORM_COMMAND.spriteTrim,
  scope: 'sprites',
  schema: spriteTrimSchema,
  run: (draft, input) => {
    for (const spriteId of input.sprites) {
      const sprite = requireSprite(draft.artwork, spriteId);
      if (sprite.role === 'tile') {
        throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" is a tile and keeps the size of its tileset.`);
      }
      const frame = trimmedFrame(sprite);
      if (frame) reframeSprite(draft, spriteId, frame);
    }
  },
});

export { spriteTrim };
