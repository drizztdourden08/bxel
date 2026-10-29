/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { distortMover } from '../region/distort-mover';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { paletteOptions } from './palette-options';
import { runResample } from './run-resample';
import { pixelsDistortSchema } from './schema/pixels-distort-schema';

const pixelsDistort = defineCommand({
  name: ADVANCED_COMMAND.pixelsDistort,
  scope: 'cels',
  schema: pixelsDistortSchema,
  run: (draft, input) => {
    const { corners, algorithm, similar, bounds, skipZero, mask } = input.options;
    const options = paletteOptions(draft.artwork, input.sprites[0], similar);
    runResample(draft, input, { mover: distortMover(corners, algorithm, options), mask, pivot: undefined, bounds, skipZero });
  },
});

export { pixelsDistort };
