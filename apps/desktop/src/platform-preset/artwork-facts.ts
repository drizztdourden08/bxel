/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank } from '@bxel/document';
import type { BankFacts, PlatformFacts } from '@bxel/presets';
import { listSprites } from '../sheet/list-sprites';

const bankFacts = (bank: PaletteBank): BankFacts => ({
  id: bank.id,
  name: bank.name,
  cap: bank.cap,
  transparent: bank.transparent,
  colours: bank.slots.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : [])),
});

const artworkFacts = (artwork: Artwork): PlatformFacts => ({
  banks: artwork.banks.map(bankFacts),
  sprites: listSprites(artwork).map((sprite) => ({ width: sprite.width, height: sprite.height })),
});

export { artworkFacts };
