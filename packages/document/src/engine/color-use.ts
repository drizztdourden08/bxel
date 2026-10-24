/* @layer core @kind logic */
import type { BankId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Artwork } from '../model/artwork.type';

const countBank = (artwork: Artwork, bank: PaletteBank): number[] => {
  const counts = new Array<number>(bank.slots.length).fill(0);
  for (const sprite of artwork.sprites) {
    if (sprite.bankId !== bank.id) continue;
    for (const cel of Object.values(sprite.cels)) {
      for (const value of cel.pixels) counts[value] = (counts[value] ?? 0) + 1;
    }
  }
  return counts;
};

const colorUse = (artwork: Artwork, bankIds: ReadonlySet<BankId>): Record<BankId, number[]> =>
  Object.fromEntries(
    artwork.banks.filter((bank) => bankIds.has(bank.id)).map((bank) => [bank.id, countBank(artwork, bank)] as const),
  );

export { colorUse };
