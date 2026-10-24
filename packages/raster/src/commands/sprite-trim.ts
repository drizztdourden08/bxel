/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { reframeSprite } from './reframe-sprite';
import { requireSizable } from './require-sizable';
import { spriteTrimSchema } from './schema/sprite-trim-schema';
import { TRANSFORM_COMMAND } from './transform-commands.constants';
import { trimmedFrame } from './trimmed-frame';

const spriteTrim = defineCommand({
  name: TRANSFORM_COMMAND.spriteTrim,
  scope: 'sprites',
  schema: spriteTrimSchema,
  run: (draft, input) => {
    for (const spriteId of input.sprites) {
      const frame = trimmedFrame(requireSizable(draft, spriteId));
      if (frame) reframeSprite(draft, spriteId, frame);
    }
  },
});

export { spriteTrim };
