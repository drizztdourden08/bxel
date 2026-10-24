/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { TURN_ORIENTATION } from '../transform/transform.constants';
import { checkTurnCoverage } from './check-turn-coverage';
import { spriteTurnSchema } from './schema/sprite-turn-schema';
import { TRANSFORM_COMMAND } from './transform-commands.constants';
import { turnSprite } from './turn-sprite';

const spriteTurn = defineCommand({
  name: TRANSFORM_COMMAND.spriteTurn,
  scope: 'cels',
  schema: spriteTurnSchema,
  run: (draft, input) => {
    checkTurnCoverage(draft.project, input);
    const orientation = TURN_ORIENTATION[input.options.direction];
    for (const spriteId of input.sprites) {
      turnSprite(draft, spriteId, orientation);
    }
  },
});

export { spriteTurn };
