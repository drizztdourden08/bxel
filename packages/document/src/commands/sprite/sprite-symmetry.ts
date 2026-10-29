/* @layer core @kind logic */
import { updateSprite } from '../../draft/update-sprite';
import { requireSprite } from '../../read/require-sprite';
import { spriteSymmetryOptionsSchema } from '../../schema/sprite-symmetry-options-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { targetSprite } from '../guide/target-sprite';
import { NO_SYMMETRY } from './sprite-symmetry.constants';
import { withSymmetry } from './with-symmetry';

const spriteSymmetry = defineCommand({
  name: COMMAND_NAME.spriteSymmetry,
  scope: 'sprite',
  schema: spriteSymmetryOptionsSchema,
  run: (draft, input) => {
    const spriteId = targetSprite(input.sprites);
    const { symmetry } = requireSprite(draft.artwork, spriteId);
    updateSprite(draft, spriteId, (current) => withSymmetry(current, { ...(symmetry ?? NO_SYMMETRY), ...input.options }));
  },
});

export { spriteSymmetry };
