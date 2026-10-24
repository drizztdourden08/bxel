/* @layer core @kind logic */
import { ERROR_CODE, defineCommand, expandNamePattern, fail, swapSprites } from '@bxel/document';
import { spriteSplitSchema } from '../schema/sprite-split-schema';
import { TRANSFORM_COMMAND } from '../transform-commands.constants';
import { buildPiece } from './build-piece';
import { claimName } from './claim-name';
import { composeSources } from './compose-sources';
import { takenNames } from './taken-names';

const spriteSplit = defineCommand({
  name: TRANSFORM_COMMAND.spriteSplit,
  scope: 'sprites',
  schema: spriteSplitSchema,
  run: (draft, input) => {
    const { pattern, start, keep } = input.options;
    const taken = takenNames(draft, input.sprites, keep);
    for (const source of composeSources(draft, input.sprites)) {
      if (source.frames.length < 2) {
        throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${source.name}" has one frame, so there is nothing to split.`);
      }
      const made = source.frames.map((_frame, at) =>
        buildPiece(draft.ids, source, {
          name: claimName(taken, expandNamePattern(pattern, source.name, start + at)),
          size: source,
          frames: [at],
          crop: null,
          pivot: source.pivot,
        }),
      );
      swapSprites(draft, { sources: [source.id], made, keep });
    }
  },
});

export { spriteSplit };
