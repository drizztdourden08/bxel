/* @layer core @kind logic */
import { ERROR_CODE, defineCommand, fail, requireBank, requireSprite } from '@bxel/document';
import { darkerTable } from '../ink/ink-table';
import { outlineCel } from '../outline/outline-cel';
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
    const { side, ring, index, selOut, mask, wrap } = input.options;
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
