/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank } from '@bxel/document';

/** The other palettes that can show a sprite: each has a swatch for every slot the sprite's palette has. */
const previewBanks = (artwork: Artwork, bank: PaletteBank): PaletteBank[] =>
  artwork.banks.filter((each) => each.id !== bank.id && each.slots.length >= bank.slots.length);

export { previewBanks };
