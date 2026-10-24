/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank, Sprite } from '@bxel/document';
import type { BankFacts, PlatformFacts } from '@bxel/presets';
import { listSprites } from '../sheet/list-sprites';

const bankFacts = (bank: PaletteBank): BankFacts => ({
  id: bank.id,
  name: bank.name,
  cap: bank.cap,
  transparent: bank.transparent,
  colours: bank.slots.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : [])),
});

const artworkFacts = (artwork: Artwork, only?: readonly Sprite[]): PlatformFacts => {
  const sprites = only ?? listSprites(artwork);
  const used = new Set(sprites.map((sprite) => sprite.bankId));
  const banks = only === undefined ? artwork.banks : artwork.banks.filter((bank) => used.has(bank.id));
  return { banks: banks.map(bankFacts), sprites: sprites.map((sprite) => ({ width: sprite.width, height: sprite.height })) };
};

export { artworkFacts };
