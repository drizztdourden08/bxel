/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { clearRegion } from '../region/clear-region';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyToCels } from './apply-to-cels';
import { checkTargets } from './check-targets';
import { pixelsClearSchema } from './schema/pixels-clear-schema';
import { uniqueCels } from './unique-cels';

const pixelsClear = defineCommand({
  name: ADVANCED_COMMAND.pixelsClear,
  scope: 'cels',
  schema: pixelsClearSchema,
  run: (draft, input) => {
    const { mask } = input.options;
    checkTargets({ project: draft.project, sprites: input.sprites, index: 0, mask });
    applyToCels(draft, uniqueCels(input.cels), (target) => clearRegion(target, mask));
  },
});

export { pixelsClear };
