/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { anchoredFrame } from './anchored-frame';
import { reframeSprite } from './reframe-sprite';
import { requireSizable } from './require-sizable';
import { spriteResizeSchema } from './schema/sprite-resize-schema';
import { TRANSFORM_COMMAND } from './transform-commands.constants';

const spriteResize = defineCommand({
  name: TRANSFORM_COMMAND.spriteResize,
  scope: 'sprites',
  schema: spriteResizeSchema,
  run: (draft, input) => {
    const { width, height, anchor } = input.options;
    for (const spriteId of input.sprites) {
      const sprite = requireSizable(draft, spriteId);
      if (sprite.width !== width || sprite.height !== height) {
        reframeSprite(draft, spriteId, anchoredFrame(sprite, { width, height }, anchor));
      }
    }
  },
});

export { spriteResize };
