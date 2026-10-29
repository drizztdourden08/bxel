/* @layer core @kind logic */
import { ERROR_CODE, defineCommand, fail, requireBank, requireSprite } from '@bxel/document';
import { darkerTable } from '../ink/darker-table';
import { outlineCel } from '../outline/outline-cel';
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
    const { side, ring, index, selOut, mask, wrap, of } = input.options;
    if (of === 'selection') {
      if (!mask || index === undefined) {
        throw fail(ERROR_CODE.INVALID_OPTION, 'Outlining a selection needs a mask and an index.', { path: mask ? 'options.index' : 'options.mask' });
      }
      checkTargets({ artwork: draft.artwork, sprites: input.sprites, index, mask });
      const edge = outlineMask(mask, side, ring);
      applyToCels(draft, uniqueCels(input.cels), (target) => paintMask(target, edge, index));
      return;
    }
    if (!selOut && index === undefined) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'An outline needs an index, or selOut to take the darker step of the ramp.', { path: 'options.index' });
    }
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: index ?? 0, mask });
    for (const cel of uniqueCels(input.cels)) {
      const darker = selOut ? darkerTable(requireBank(draft.artwork, requireSprite(draft.artwork, cel.spriteId).bankId)) : undefined;
      applyToCels(draft, [cel], (target) => outlineCel(target, { side, ring, index, darker, mask, wrap }));
    }
  },
});

export { pixelsOutline };
