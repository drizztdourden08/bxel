/* @layer core @kind logic */
import { defineCommand, requireBank, requireSprite } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { assignSprites } from './assign-sprites';
import { checkAssignTarget } from './check-assign-target';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteAssignSchema } from './palette-assign-schema';
import { resolveAssignPairs } from './resolve-assign-pairs';

const paletteAssign = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteAssign,
  scope: 'sprites',
  schema: paletteAssignSchema,
  run: (draft, input) => {
    const dest = requireBank(draft.artwork, input.options.bankId as BankId);
    const sprites = input.sprites.map((id) => requireSprite(draft.artwork, id));
    checkAssignTarget(dest, sprites);
    const sources = [...new Set(sprites.map((sprite) => sprite.bankId))].map((id) => requireBank(draft.artwork, id));
    const pairs = resolveAssignPairs(sources, dest, input.options.mapping);
    assignSprites(draft, dest, sprites, pairs);
  },
});

export { paletteAssign };
