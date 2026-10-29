/* @layer core @kind logic */
import { defineCommand } from '@bxel/document';
import { paintMask } from '../region/paint-mask';
import { outlineMask } from '../selection/outline-mask';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyToCels } from './apply-to-cels';
import { checkTargets } from './check-targets';
import { pixelsOutlineSchema } from './schema/pixels-outline-schema';
import { uniqueCels } from './unique-cels';

const pixelsOutline = defineCommand({
  name: ADVANCED_COMMAND.pixelsOutline,
  scope: 'cels',
  schema: pixelsOutlineSchema,
  run: (draft, input) => {
    const { mask, side, connectivity, index } = input.options;
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index, mask });
    const ring = outlineMask(mask, side, connectivity);
    applyToCels(draft, uniqueCels(input.cels), (target) => paintMask(target, ring, index));
  },
});

export { pixelsOutline };
