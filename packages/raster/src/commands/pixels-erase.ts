/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand } from '@bxel/document';
import { runStroke } from './run-stroke';
import { pixelsEraseSchema } from './schema/pixels-erase-schema';

const pixelsErase = defineCommand({
  name: COMMAND_NAME.pixelsErase,
  scope: 'cels',
  schema: pixelsEraseSchema,
  run: (draft, input) => {
    runStroke(draft, input, 0);
  },
});

export { pixelsErase };
