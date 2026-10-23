/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand } from '@bxel/document';
import { runStroke } from './run-stroke';
import { pixelsPaintSchema } from './schema/pixels-paint-schema';

const pixelsPaint = defineCommand({
  name: COMMAND_NAME.pixelsPaint,
  scope: 'cels',
  schema: pixelsPaintSchema,
  run: (draft, input) => {
    runStroke(draft, input, input.options.index);
  },
});

export { pixelsPaint };
