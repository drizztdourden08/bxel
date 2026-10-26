/* @layer core @kind logic */
import { defineCommand, ERROR_CODE, fail, requireBank, updateArtwork } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { bankSprites } from './bank-sprites';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteDeleteSchema } from './palette-delete-schema';

const paletteDelete = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteDelete,
  scope: 'none',
  schema: paletteDeleteSchema,
  run: (draft, input) => {
    const bank = requireBank(draft.artwork, input.options.bankId as BankId);
    if (bank.id === draft.artwork.defaultBankId) {
      throw fail(ERROR_CODE.DEFAULT_BANK, 'The default palette cannot be deleted.', { path: 'options.bankId' });
    }
    if (draft.artwork.animations.some((animation) => animation.bankId === bank.id)) {
      throw fail(ERROR_CODE.BANK_IN_USE, `An animation still uses palette "${bank.name}".`, { path: 'options.bankId' });
    }
    const users = bankSprites(draft.artwork, bank.id);
    if (users.length > 0) {
      throw fail(ERROR_CODE.BANK_IN_USE, `${users.length} sprites still use palette "${bank.name}".`, {
        path: 'options.bankId',
        details: users.map((sprite) => ({ spriteId: sprite.id, layerId: null, frameId: null, reason: 'uses this palette' })),
      });
    }
    if (draft.artwork.tilesets.some((tileset) => tileset.bankId === bank.id)) {
      throw fail(ERROR_CODE.BANK_IN_USE, `A tileset still uses palette "${bank.name}".`, { path: 'options.bankId' });
    }
    updateArtwork(draft, (artwork) => ({ ...artwork, banks: artwork.banks.filter((other) => other.id !== bank.id) }));
  },
});

export { paletteDelete };
