/* @layer core @kind logic */
import { defineCommand, freeName, registerRef, swapSprites } from '@bxel/document';
import { spriteMergeSchema } from '../schema/sprite-merge-schema';
import { TRANSFORM_COMMAND } from '../transform-commands.constants';
import { buildMerged } from './build-merged';
import { claimName } from './claim-name';
import { mergeSources } from './merge-sources';
import { takenNames } from './taken-names';

const spriteMerge = defineCommand({
  name: TRANSFORM_COMMAND.spriteMerge,
  scope: 'sprites',
  schema: spriteMergeSchema,
  run: (draft, input) => {
    const { name, anchor, keep } = input.options;
    const sources = mergeSources(draft, input.sprites);
    const taken = takenNames(draft, input.sprites, keep);
    const [lead] = sources;
    const label = name === undefined ? freeName(taken, keep ? `${lead.name} merged` : lead.name) : claimName(taken, name);
    const merged = buildMerged(draft.ids, sources, { name: label, anchor });
    swapSprites(draft, { sources: input.sprites, made: [merged], keep });
    registerRef(draft, input.ref, merged.id);
  },
});

export { spriteMerge };
