/* @layer core @kind logic */
import { defineCommand, swapSprites } from '@bxel/document';
import { spriteSliceSchema } from '../schema/sprite-slice-schema';
import { TRANSFORM_COMMAND } from '../transform-commands.constants';
import { composeSources } from './compose-sources';
import { slicePieces } from './slice-pieces';
import { takenNames } from './taken-names';

const spriteSlice = defineCommand({
  name: TRANSFORM_COMMAND.spriteSlice,
  scope: 'sprites',
  schema: spriteSliceSchema,
  run: (draft, input) => {
    const { keep } = input.options;
    const taken = takenNames(draft, input.sprites, keep);
    for (const source of composeSources(draft, input.sprites)) {
      const made = slicePieces(draft, source, input.options, taken);
      swapSprites(draft, { sources: [source.id], made, keep });
    }
  },
});

export { spriteSlice };
