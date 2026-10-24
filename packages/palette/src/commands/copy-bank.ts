/* @layer core @kind logic */
import type { BankId, IdSource, PaletteBank, RampId, SwatchId } from '@bxel/document';

const copyBank = (ids: IdSource, bank: PaletteBank, name: string, created: number | undefined): PaletteBank => {
  const swatchIds = new Map(bank.slots.map((slot) => [slot.id, ids.next('sw') as SwatchId] as const));
  return {
    ...bank,
    id: ids.next('bnk') as BankId,
    name,
    created,
    slots: bank.slots.map((slot) => ({ ...slot, id: swatchIds.get(slot.id) ?? slot.id })),
    ramps: bank.ramps.map((ramp) => ({
      id: ids.next('rmp') as RampId,
      name: ramp.name,
      swatches: ramp.swatches.map((id) => swatchIds.get(id) ?? id),
    })),
  };
};

export { copyBank };
