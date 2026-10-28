/* @layer core @kind logic */
import { remapBank } from '@bxel/document';
import type { Draft, PaletteBank, Swatch } from '@bxel/document';
import { buildReorderTables } from '../build-reorder-tables';
import { checkOrder } from './check-order';
import { updateBank } from './update-bank';

const reorderBank = (draft: Draft, bank: PaletteBank, order: readonly string[]): void => {
  const indices = checkOrder(bank, order);
  if (indices.every((slot, position) => slot === position)) return;
  const { forward, inverse } = buildReorderTables(indices);
  remapBank(draft, { bankId: bank.id, forward, inverse });
  const byId = new Map(bank.slots.map((slot) => [String(slot.id), slot] as const));
  const slots = order.flatMap((id): Swatch[] => {
    const slot = byId.get(id);
    return slot ? [slot] : [];
  });
  updateBank(draft, bank.id, (current) => ({ ...current, slots }));
};

export { reorderBank };
