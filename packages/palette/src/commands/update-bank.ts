/* @layer core @kind logic */
import { updateArtwork } from '@bxel/document';
import type { BankId, Draft, PaletteBank } from '@bxel/document';

const updateBank = (draft: Draft, bankId: BankId, change: (bank: PaletteBank) => PaletteBank): void => {
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    banks: artwork.banks.map((bank) => (bank.id === bankId ? change(bank) : bank)),
  }));
};

export { updateBank };
