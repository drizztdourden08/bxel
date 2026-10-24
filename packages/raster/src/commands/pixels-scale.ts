/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { scaleMover } from '../region/scale-mover';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { runResample } from './run-resample';
import { pixelsScaleSchema } from './schema/pixels-scale-schema';

const pixelsScale = defineCommand({
  name: ADVANCED_COMMAND.pixelsScale,
  scope: 'cels',
  schema: pixelsScaleSchema,
  run: (draft, input) => {
    const { target, anchor, bounds, skipZero, mask } = input.options;
    runResample(draft, input, { mover: scaleMover({ target, anchor }), mask, pivot: undefined, bounds, skipZero });
  },
});

export { pixelsScale };
