/* @layer core @kind logic */
import type { BankId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Artwork } from '../model/artwork.type';

const findBank = (artwork: Artwork, id: BankId): PaletteBank | undefined =>
  artwork.banks.find((bank) => bank.id === id);

export { findBank };
