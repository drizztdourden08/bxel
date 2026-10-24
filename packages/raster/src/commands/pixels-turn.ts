/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { TURN_ORIENTATION } from '../transform/transform.constants';
import { runRegion } from './run-region';
import { pixelsTurnSchema } from './schema/pixels-turn-schema';
import { TRANSFORM_COMMAND } from './transform-commands.constants';

const pixelsTurn = defineCommand({
  name: TRANSFORM_COMMAND.pixelsTurn,
  scope: 'cels',
  schema: pixelsTurnSchema,
  run: (draft, input) => {
    runRegion(draft, input, TURN_ORIENTATION[input.options.direction]);
  },
});

export { pixelsTurn };
