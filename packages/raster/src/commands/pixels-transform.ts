/* @layer core @kind logic */
import { ERROR_CODE, defineCommand, fail } from '@bxel/document';
import { affineMatrix } from '../region/affine-matrix';
import { affineMover } from '../region/affine-mover';
import { determinant } from '../region/determinant';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { paletteOptions } from './palette-options';
import { runResample } from './run-resample';
import { MIN_DETERMINANT } from './schema/pixels-transform-schema.constants';
import { pixelsTransformSchema } from './schema/pixels-transform-schema';

const pixelsTransform = defineCommand({
  name: ADVANCED_COMMAND.pixelsTransform,
  scope: 'cels',
  schema: pixelsTransformSchema,
  run: (draft, input) => {
    const { algorithm, similar, bounds, skipZero, mask, scale, angle, skew, offset, pivot, matrix } = input.options;
    const flat = Math.abs(determinant(affineMatrix({ scale, angle, skew, offset, pivot, matrix }))) <= MIN_DETERMINANT;
    if (flat) throw fail(ERROR_CODE.INVALID_OPTION, 'The transform would flatten the region to nothing.', { path: 'options.scale' });
    const options = paletteOptions(draft.artwork, input.sprites[0], similar);
    const mover = affineMover({ scale, angle, skew, offset, pivot, matrix }, algorithm, options);
    runResample(draft, input, { mover, mask, pivot: undefined, bounds, skipZero });
  },
});

export { pixelsTransform };
