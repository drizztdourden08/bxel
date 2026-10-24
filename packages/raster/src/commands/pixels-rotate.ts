/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { rotateMover } from '../region/rotate-mover';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { runResample } from './run-resample';
import { pixelsRotateSchema } from './schema/pixels-rotate-schema';

const pixelsRotate = defineCommand({
  name: ADVANCED_COMMAND.pixelsRotate,
  scope: 'cels',
  schema: pixelsRotateSchema,
  run: (draft, input) => {
    const { angle, pivot, bounds, skipZero, mask } = input.options;
    runResample(draft, input, { mover: rotateMover(angle), mask, pivot, bounds, skipZero });
  },
});

export { pixelsRotate };
