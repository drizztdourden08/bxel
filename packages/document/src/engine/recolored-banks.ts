/* @layer core @kind logic */
import type { BankId } from '../model/ids.type';
import type { PaletteBank, Swatch } from '../model/palette.type';
import type { Artwork } from '../model/artwork.type';

const slotColor = (slot: Swatch): string => (slot.kind === 'color' ? slot.rgb : '');

const colorsDiffer = (before: PaletteBank, after: PaletteBank): boolean =>
  before.transparent !== after.transparent ||
  before.slots.some((slot, index) => {
    const other = after.slots[index];
    return other !== undefined && slotColor(slot) !== slotColor(other);
  });

const recoloredBanks = (before: Artwork, after: Artwork): Set<BankId> => {
  const recolored = new Set<BankId>();
  for (const bank of after.banks) {
    const prior = before.banks.find((item) => item.id === bank.id);
    if (prior && prior !== bank && colorsDiffer(prior, bank)) recolored.add(bank.id);
  }
  return recolored;
};

export { recoloredBanks };
