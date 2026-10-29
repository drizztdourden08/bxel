/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { paletteOptions } from './palette-options';
import { rotateMover } from '../region/rotate-mover';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { runResample } from './run-resample';
import { pixelsRotateSchema } from './schema/pixels-rotate-schema';

const pixelsRotate = defineCommand({
  name: ADVANCED_COMMAND.pixelsRotate,
  scope: 'cels',
  schema: pixelsRotateSchema,
  run: (draft, input) => {
    const { angle, pivot, bounds, skipZero, mask, algorithm, similar } = input.options;
    const options = paletteOptions(draft.artwork, input.sprites[0], similar);
    runResample(draft, input, { mover: rotateMover(angle, algorithm, options), mask, pivot, bounds, skipZero });
  },
});

export { pixelsRotate };
