/* @layer core @kind logic */
import { ERROR_CODE, defineCommand, fail } from '@bxel/document';
import { reframeSprite } from './reframe-sprite';
import { requireSizable } from './require-sizable';
import { spriteCropSchema } from './schema/sprite-crop-schema';
import { TRANSFORM_COMMAND } from './transform-commands.constants';

const spriteCrop = defineCommand({
  name: TRANSFORM_COMMAND.spriteCrop,
  scope: 'sprites',
  schema: spriteCropSchema,
  run: (draft, input) => {
    const frame = input.options;
    for (const spriteId of input.sprites) {
      const sprite = requireSizable(draft, spriteId);
      if (frame.x + frame.width > sprite.width || frame.y + frame.height > sprite.height) {
        throw fail(ERROR_CODE.INVALID_OPTION, `The crop reaches outside sprite "${sprite.name}".`);
      }
      if (frame.width !== sprite.width || frame.height !== sprite.height) reframeSprite(draft, spriteId, frame);
    }
  },
});

export { spriteCrop };
