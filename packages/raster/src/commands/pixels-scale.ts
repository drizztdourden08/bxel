/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { paletteOptions } from './palette-options';
import { scaleMover } from '../region/scale-mover';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { runResample } from './run-resample';
import { pixelsScaleSchema } from './schema/pixels-scale-schema';

const pixelsScale = defineCommand({
  name: ADVANCED_COMMAND.pixelsScale,
  scope: 'cels',
  schema: pixelsScaleSchema,
  run: (draft, input) => {
    const { target, anchor, bounds, skipZero, mask, algorithm, similar } = input.options;
    const options = paletteOptions(draft.artwork, input.sprites[0], similar);
    runResample(draft, input, { mover: scaleMover({ target, anchor }, algorithm, options), mask, pivot: undefined, bounds, skipZero });
  },
});

export { pixelsScale };
