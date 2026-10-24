/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { moveMover } from '../region/move-mover';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { runResample } from './run-resample';
import { pixelsMoveSchema } from './schema/pixels-move-schema';

const pixelsMove = defineCommand({
  name: ADVANCED_COMMAND.pixelsMove,
  scope: 'cels',
  schema: pixelsMoveSchema,
  run: (draft, input) => {
    const { offset, skipZero, mask } = input.options;
    runResample(draft, input, { mover: moveMover(offset), mask, pivot: undefined, bounds: 'crop', skipZero });
  },
});

export { pixelsMove };
