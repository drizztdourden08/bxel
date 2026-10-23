/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { FLIP_ORIENTATION } from '../transform/transform.constants';
import { runRegion } from './run-region';
import { pixelsFlipSchema } from './schema/pixels-flip-schema';
import { TRANSFORM_COMMAND } from './transform-commands.constants';

const pixelsFlip = defineCommand({
  name: TRANSFORM_COMMAND.pixelsFlip,
  scope: 'cels',
  schema: pixelsFlipSchema,
  run: (draft, input) => {
    runRegion(draft, input, FLIP_ORIENTATION[input.options.axis]);
  },
});

export { pixelsFlip };
