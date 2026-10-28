/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { affineMover } from '../region/affine-mover';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { paletteOptions } from './palette-options';
import { runResample } from './run-resample';
import { pixelsTransformSchema } from './schema/pixels-transform-schema';

const pixelsTransform = defineCommand({
  name: ADVANCED_COMMAND.pixelsTransform,
  scope: 'cels',
  schema: pixelsTransformSchema,
  run: (draft, input) => {
    const { algorithm, similar, bounds, skipZero, mask, scale, angle, skew, offset, pivot, matrix } = input.options;
    const options = paletteOptions(draft.artwork, input.sprites[0], similar);
    const mover = affineMover({ scale, angle, skew, offset, pivot, matrix }, algorithm, options);
    runResample(draft, input, { mover, mask, pivot: undefined, bounds, skipZero });
  },
});

export { pixelsTransform };
