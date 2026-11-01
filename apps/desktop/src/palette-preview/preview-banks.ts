/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank } from '@bxel/document';

const previewBanks = (artwork: Artwork, bank: PaletteBank): PaletteBank[] =>
  artwork.banks.filter((each) => each.id !== bank.id && each.slots.length >= bank.slots.length);

export { previewBanks };
