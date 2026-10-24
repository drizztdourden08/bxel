/* @layer core @kind logic */
import { ERROR_CODE, defineCommand, fail, requireSprite } from '@bxel/document';
import { anchoredFrame } from './anchored-frame';
import { reframeSprite } from './reframe-sprite';
import { spriteResizeSchema } from './schema/sprite-resize-schema';
import { TRANSFORM_COMMAND } from './transform-commands.constants';

const spriteResize = defineCommand({
  name: TRANSFORM_COMMAND.spriteResize,
  scope: 'sprites',
  schema: spriteResizeSchema,
  run: (draft, input) => {
    const { width, height, anchor } = input.options;
    for (const spriteId of input.sprites) {
      const sprite = requireSprite(draft.artwork, spriteId);
      if (sprite.role === 'tile') {
        throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" is a tile and keeps the size of its tileset.`);
      }
      if (sprite.width !== width || sprite.height !== height) {
        reframeSprite(draft, spriteId, anchoredFrame(sprite, { width, height }, anchor));
      }
    }
  },
});

export { spriteResize };
